import React, { Component } from "react";
import { Spin } from "antd";
import ListView from "./ListView";
import DetailView from "./DetailView";
import { getList, getEntity } from "../redux/actions/entity";


class DataTable extends Component {
    render() {
        const { displayEntity } = this.props.store.meta;
        const { many, entityType, loading } = displayEntity || {};

        return (
            <div>
                <Spin spinning={loading} style={{ margin: '4%' }} />
                {entityType && (
                    <div style={{ margin: '4%' }}>
                        {many ? (
                            <ListView {...this.props} />
                        ) : (
                            <DetailView {...this.props} />
                            )
                        }
                    </div>
                )}
            </div>
        );
    }
}

export default DataTable;