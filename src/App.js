import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import mapStateToProps from './redux/utils';
import DataTable from './components/DataTable';
import { getList } from './redux/actions/entity';
import {updateLoadingIndicator} from './redux/actions/meta';

const { Sider, Content } = Layout;
const MenuItem = Menu.Item;

class App extends Component {
  async handleMenuItemClick({ key }) {
    this.props.dispatch(updateLoadingIndicator(true));
    await this.props.dispatch(getList(key));
    this.props.dispatch(updateLoadingIndicator(false));
  }

  render() {
    const { entityRegistered } = this.props.store.registry;

    const menuComponent = (
      entityRegistered && entityRegistered.length ?
        <Menu onClick={this.handleMenuItemClick.bind(this)}>
          {entityRegistered.map(entity => (
            <MenuItem key={entity}>{entity}</MenuItem>
          ))}
        </Menu>
        :
        <span>No Entity Found</span>
    );

    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider>
            {menuComponent}
          </Sider>
          <Content>
            <DataTable store={this.props.store} dispatch={this.props.dispatch} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
