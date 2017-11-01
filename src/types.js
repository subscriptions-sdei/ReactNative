// @flow

export type UserType ={

};

export type DietType ={

};

export type ClientType ={

};

export type FoodType ={

}

export type State={
  user: UserType, 
  diet: DietType, 
  currentClient: ClientType, 
  foods: Array<FoodType>
}

export type rowDataType = {
  title: string,
  icon: string,
  onPress: void
}