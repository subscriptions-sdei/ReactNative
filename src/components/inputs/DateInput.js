// @flow

let React = require('react');

import moment from 'moment';

import {
  DatePickerIOS,
} from 'react-native'

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = { date: props.value || new Date() };
  }

  onChange(date) {
    this.setState({ date: date });

    let d = moment(new Date(date)).format('YYYY-MM-DD');
    this.props.onChange(d);
  }

  render() {
    return (
      <DatePickerIOS
        mode="date"
        onDateChange={this.onChange}
        date={new Date(this.state.date)} />
    );
  }
}
