// @flow

let React = require('react');

import {
  View,
  ListView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'

const ds = new ListView.DataSource({ rowHasChanged: (r1,r2) => (r1 !== r2) });

export default class SelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.state = {
      dataSource: ds.cloneWithRows(this.props.list),
    };
  }

  onSelect(data) {
    this.props.onSelect(data);
  }

  renderSeparator(data) {
    const separatorStyle = this.props.separatorStyle || styles.separator;

    if (data === this.props.list[0]) {
      return null;
    }

    return <View style={separatorStyle} />;
  }

  renderRow(rowData) {
    const rowTextStyle = this.props.rowText || styles.rowText;

    return (
      <View>
        {this.renderSeparator(rowData)}
        <TouchableOpacity onPress={() => this.onSelect(rowData.value)}>
           <Text style={rowTextStyle}>{rowData.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        automaticallyAdjustContentInsets={false} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
  },
  rowText: {
    padding: 20,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#CCC',
  },
});
