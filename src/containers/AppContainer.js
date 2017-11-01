// @flow

import React from 'react';
import { connect } from 'react-redux';

import Loading from 'components/Loading';
import Routes from '../Routes';
import { manager, ReactCBLite } from 'react-native-couchbase-lite'
import designDocs from 'libs/database_design_docs';
import api from 'libs/api';
import config from 'libs/config';

import { Platform } from 'react-native';

class AppContainer extends React.Component{
  state = { loading: true, database: null };

  componentWillMount() {
    this.setState({ loading: true });

    ReactCBLite.init((url) => {
      console.log("couchbase lite url: ", url);

      if(Platform.OS === 'ios') {
        url = "http://lite.couchbase./";
      }

      let database = new manager(url, 'litehq');

      database.createDatabase()
        .then(() => {
          api.setDatabase(database);
          this.setState({ database: database });
          this.setState({ loading: false });

          let user = this.props.user;
          if(!user.sesssion)
            return;

          let sessionCookie = `${user.session.cookie_name}=${user.session.session_id}`;
          let remote = `${config.sync_api}/${config.database}`;

          let options = {
            headers: { Cookie: sessionCookie },
            url: remote
          };

          api.replicateLocal(options);
          api.replicateRemote(options);
        });
    });
  }

  componentWillUpdate() {
    if(this.state.database)
      this.state.database.createDesignDocument('litehq_design_doc', designDocs);
  }

  render() {
    if(this.state.loading)
      return <Loading />

    return <Routes />
  }
};

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(AppContainer)
