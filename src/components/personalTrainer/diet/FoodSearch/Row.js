// @flow

import React from 'react';
import Highlighter from  'react-native-highlight-words';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

export default class Row extends React.Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  renderImage(image) {
    if (image) {
      return (
        <View style={styles.listImage}>
          <Image
            style={styles.image}
            shouldRasterizeIOS={true}
            source={{ uri: image.replace('jpg', 'png') }} />
        </View>
      )
    }

    return <View style={[styles.listImage, { backgroundColor: '#DFDCDC' }]}></View>
  }

  getStyleRow(selected) {
    let style = {
      paddingLeft: 5,
      paddingVertical: 10,
      flexDirection: 'row',
      overflow: 'hidden',
      borderColor: '#BFBFBF',
      borderBottomWidth: (selected ? 0 : 0.3)
    }

    if (selected) style.backgroundColor = '#f8f8f8';

    return style;
  }

  render() {
    let food = this.props.food;
    const searchWords = this.props.searchText!= undefined ? this.props.searchText.split(" "): [this.props.searchText];

    let macros = {
      calories: this.props.selected ? this.props.macros.calories : food.calories,
      protein: this.props.selected ? this.props.macros.protein : food.protein,
      carbs: this.props.selected ? this.props.macros.carbs : food.carbs,
      fat: this.props.selected ? this.props.macros.fat : food.fat
    }

    return (
      <View style={this.getStyleRow(this.props.selected)} ref={(n) => this._root = n}>
        {this.renderImage(food.image)}

        <View style={styles.listDetail}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Highlighter
                searchWords={searchWords}
                highlightStyle={{backgroundColor: 'yellow'}} style={{ flex: 0.8, fontSize: 14 }}
                textToHighlight={food.name} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.macroHeader}>Calories: </Text>
              <Text style={styles.macroText}>{macros.calories}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.macroHeader}>Protein: </Text>
              <Text style={styles.macroText}>{macros.protein}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.macroHeader}>Carbs: </Text>
              <Text style={styles.macroText}>{macros.carbs}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.macroHeader}>Fats: </Text>
              <Text style={styles.macroText}>{macros.fat}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  listRow: {
    paddingLeft: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  listDetail: {
    flex: 2,
    alignSelf: 'center',
    paddingRight: 15
  },
  listImage: {
    flex: 0,
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 100,
    padding: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  image: {
    height: 45,
    width: 45,
    alignSelf: 'center'
  },
  macroHeader: {
    fontSize: 11,
    color: '#7c7c7c'
  },
  macroText: {
    fontSize: 11,
    marginLeft: 2,
    color: '#7c7c7c'
  }
});
