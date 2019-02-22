import React, { Component } from "react";
import Async from "react-promise";
import { Table, Spin } from "antd";
import { getEntity } from "../redux/actions/entity";

const Column = Table.Column;

export default class DetailView extends Component {
    state = {
        entity: {},
    }

    componentDidMount() {
        this.getOrFetchCurrentEntity();
    }

    async getOrFetchCurrentEntity() {
        const { entities } = this.props.store.entity;
        const { displayEntity } = this.props.store.meta;
        const { entityType, entityIds } = displayEntity || {};

        if (!entities[entityType] && !entities[entityType][entityIds]) {
            await this.props.dispatch(getEntity(entityType, entityIds));
        }

        this.setState({ entity: entities[entityType][entityIds] });
    }

    async getOrFetchEntityValue({ type, id, link }) {
        const { entities } = this.props.store.entity;
        if (!(entities[type] && entities[type][id])) {
            await this.props.dispatch(getEntity(type, id, link));
        }
        return Promise.resolve(entities[type][id]);
    }

    renderValueList(record /* with data in array */) {
        // show only attr
        const link = record.links ? record.links.self : undefined;
        const values = record.data;
        return (
            <div>
                {values.length > 0 ? values.map(v => {
                    return (
                        <Async
                            key={v.key}
                            promise={this.getOrFetchEntityValue({ type: v.type, id: v.id, link })}
                            then={val => (
                                <div key={v.key}>
                                    {val.attributes && Object.entries(val.attributes).map(a => (
                                        <div key={a[1]}>{a[0]}: {a[1]}</div>
                                    ))}
                                </div>
                            )}
                            pending={() => (<div key={v.key}><Spin /></div>)}
                            catch={(err) => (<div key={v.key}>{err.message || ''}</div>)}
                        />
                    );
                }) : (<div> - </div>)}
            </div>
        )
    }

    render() {
        const { entity } = this.state;
        const { attributes, relationships } = entity;
        let dataSource = [
            ...Object.entries(attributes || {}),
            ...Object.entries(relationships || {}),
        ];
        dataSource = dataSource.filter((x) => {
            return !!x[1].data || x[1] !== Object(x[1]);    // Filter the ones without data attribute and is not a string.
        }).map(d => ({
            key: d[0],
            value: (d[1] !== Object(d[1]) ? d[1] : undefined),
            ...(d[1] === Object(d[1]) ? d[1] : {})
        }));

        return (
            <div>
                <h1>{`${entity.type} - #${entity.id}`}</h1>
                {entity && (
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                    >
                        <Column
                            key="0"
                            render={(text, record, index) => (
                                <span>{record.key}</span>
                            )}
                        />
                        <Column
                            key="1"
                            render={(text, record, index) => {
                                if (record.data && !Array.isArray(record.data)) { record.data = [record.data]; }
                                return (
                                    <div>
                                        {record.data ?
                                            this.renderValueList(record) :
                                            <span>{record.value}</span>}
                                    </div>
                                );
                            }}
                        />
                    </Table>
                )}
            </div>
        );
    }
}