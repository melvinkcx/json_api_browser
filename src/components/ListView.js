import React, { Component } from 'react';
import { Table } from "antd";
import { getList, getEntity } from "../redux/actions/entity";
import { updateCurrentDisplayEntity } from '../redux/actions/meta';


export default class ListView extends Component {
    async onRowClick(entityType, { key }) {
        const { entities } = this.props.store.entity;
        if (!entities[entityType] && !entities[entityType][key]) {
            await this.props.dispatch(getEntity(entityType, key));
        }

        // update display entity
        this.props.dispatch(updateCurrentDisplayEntity({ many: false, entityType, entityIds: key }));
    }

    onPageClick(entityType, page, pageSize) {
        this.props.dispatch(getList(entityType, page, pageSize));
    }

    render() {
        const { displayEntity, pagination } = this.props.store.meta;
        const { entities } = this.props.store.entity;
        const { many, entityType, loading } = displayEntity || {};
        const { page, pages, count } = pagination || {};

        let dataSource = Object.values(entities[entityType] || {});
        let entityAttributes = Object.keys((Object.values(entities[entityType] || {})[0] || {}).attributes || {})

        if (dataSource.length > 0) {
            dataSource = dataSource.map(x => ({
                ...x.attributes,
                key: x.id,
                id: x.id,
            }));
        }
        if (entityAttributes.length > 0) {
            entityAttributes = entityAttributes.map(x => ({
                title: x,
                key: x,
                dataIndex: x,
                sortOrder: false,
            }));
            entityAttributes = [{
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
                sortOrder: false,
            }, ...entityAttributes];
        }

        return (
            <Table
                columns={entityAttributes}
                dataSource={dataSource}
                pagination={{
                    total: count,
                    current: page,
                    pageSize: 5,
                    pageSizeOptions: ['5', '10'],
                    onChange: (page, pageSize) => { this.onPageClick(entityType, page, pageSize) },
                }}
                onRow={(record, index) => ({
                    onClick: () => { this.onRowClick(entityType, record) }
                })}
            />
        );
    }
}