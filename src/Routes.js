// @flow

import React from 'react';
import { connect } from 'react-redux';

import { Actions, Scene, Router, Modal, Reducer } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';
import TabView from 'components/personalTrainer/TabView';

// Containers
import LoginContainer from 'containers/LoginContainer';
import MealPlanContainer from 'containers/personalTrainer/MealPlanContainer';
import NewDiet from "containers/personalTrainer/NewDietContainer";
import PTClientMenu from 'containers/personalTrainer/ClientMenu';
import ClientProfile from 'containers/personalTrainer/ClientProfile';
import TutorialContainer from 'containers/tutorial/TutorialContainer';
// Components
import Calories from "components/personalTrainer/diet/Calories";
import FoodSearch from 'components/personalTrainer/diet/FoodSearch';
import NewClient from 'components/personalTrainer/client/NewClient';
import ModalBox from 'components/ModalBox';
import SelectUserType from 'components/SelectUserType';

// Personal Trainer Components
import Clients from 'containers/personalTrainer/Clients';
import DietHistory from "containers/personalTrainer/DietHistory";

// Client
import SignUpProfile from 'components/client/signup/SignUpProfile';
import SignUpGoal from 'components/client/signup/SignUpGoal';
import SignUpActivity from 'components/client/signup/SignUpActivity';
import SignUpShortList from 'components/client/signup/SignUpShortList';
import ClientMore from 'containers/client/More';
import ClientHome from 'containers/client/Home';
import ClientTraining from 'containers/client/TrainingContainer';
import ClientDiets from 'containers/client/DietsContainer';
import ClientDiet from 'containers/client/DietContainer';
import ClientShortList from 'containers/client/ShortListContainer';
import FoodSwapContainer from 'containers/client/FoodSwapContainer';

import {
  StatusBar
} from 'react-native';

class TabIcon extends React.Component {
  render() {
    return(
      <Icon
        name={this.props.iconName}
        size={25}
        color={this.props.selected ? '#22BCED' : '#403e3e'} />
    )
  }
}

const reducerCreate = params => {
    const defaultReducer = Reducer(params);
    return (state, action) => {
        // NOTE: List of new screen with new statusbar color
        let list = ['clientDashboard','clientDiet']
        if(action.key && list.indexOf(action.key) === -1) {
          StatusBar.setBarStyle('dark-content', false)
        }

        return defaultReducer(state, action);
    }
};

class Routes extends React.Component{
  setBarStyle(style, animated) {
    StatusBar.setBarStyle(style, animated);
  }

  render() {
    return  (
      <Router createReducer={reducerCreate}>
        <Scene key="modal" component={Modal} >
          <Scene key="root" hideNavBar={false}>
            <Scene
              key="modalBox"
              hideNavBar={true}
              component={ModalBox}
              title="Login2"
              panHandlers={null}
              direction="vertical" />

            <Scene
              key="selectUserType"
              component={SelectUserType}
              type="replace" title=""
              titleStyle={styles.signupNavTitleStyle} />

            {/* ================================================================= */}
            {/* ------------------------ CLIENT SCENES -------------------------- */}
            {/* ================================================================= */}
            <Scene
              key="signupProfile"
              component={SignUpProfile}
              type="replace" title="Profile"
              navigationBarStyle={styles.signupNav}
              rightButtonTextStyle={{ color: '#FFFFFF' }}
              titleStyle={styles.signupNavTitleStyle} />

            <Scene
              key="signupGoal"
              component={SignUpGoal}
              title="Goal"
              rightTitle="next"
              onRight={() => Actions.signupActivity()}
              navigationBarStyle={styles.signupNav}
              rightButtonTextStyle={{ color: '#FFFFFF' }}
              titleStyle={styles.signupNavTitleStyle} />

            <Scene
              key="signupActivity"
              component={SignUpActivity}
              title="Activity Level"
              navigationBarStyle={styles.signupNav}
              rightButtonTextStyle={{ color: '#FFFFFF' }}
              titleStyle={styles.signupNavTitleStyle} />

            <Scene
              key="signupShortList"
              component={SignUpShortList}
              title="Short List" />

            <Scene
              key="clientDiets"
              component={ClientDiets}
              title="Diet"
              icon={TabIcon}
              iconName="cutlery" />

            <Scene
              key="clientDashboard"
              tabs={true}
              type="reset"
              tabBarStyle={styles.tabBarStyle}
              tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}>

              <Scene
                key="clientHome"
                component={ClientHome}
                title="Home"
                icon={TabIcon}
                iconName="home"
                navigationBarStyle={{ backgroundColor: '#13C7C8' }}
                titleStyle={{ color:'white' }} />

              {/*
              TODO: Implement Client Training Screen
              <Scene
                key="clientTraining"
                component={ClientTraining}
                title="Training"
                icon={TabIcon}
                iconName="user" />
              */}

              <Scene
                key="clientMore"
                component={ClientMore}
                title="More"
                icon={TabIcon}
                iconName="ellipsis-h" />
            </Scene>

            <Scene
              key="clientDiet"
              component={ClientDiet}
              title="Today's Meal"
              leftButtonIconStyle={{ tintColor:'white' }}
              navigationBarStyle={{ backgroundColor: '#13C7C8' }}
              titleStyle={{ color:'white' }}
              onBack={() => {
                this.setBarStyle('dark-content', true);
                Actions.pop();
              }} />

            <Scene
              key="clientShortList"
              component={ClientShortList}
              title="Short List" />

            <Scene
              key="foodSwap"
              component={FoodSwapContainer}
              leftButtonIconStyle={{ tintColor:'white' }}
              navigationBarStyle={{ backgroundColor: '#13C7C8' }}
              titleStyle={{ color:'white' }}
              title="Food Swapper"
              onBack={() => {
                this.setBarStyle('dark-content', true);
                Actions.pop();
              }} />

            {/* ================================================================= */}
            {/* -------------------- PERSONAL TRAINER SCENES -------------------- */}
            {/* ================================================================= */}
            <Scene
              key="personalTrainerDashboard"
              tabs={true}
              type="replace"
              tabBarStyle={styles.tabBarStyle}
              tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}>

              <Scene
                key="clients"
                component={connect(mapStateToProps)(TabView)}
                title="Clients"
                icon={TabIcon}
                iconName="users"
                rightTitle="New Client"
                onRight={() => Actions.newClient()} />

              <Scene
                key="more"
                component={connect(mapStateToProps)(TabView)}
                title="More"
                icon={TabIcon}
                iconName="ellipsis-h" />
            </Scene>

            <Scene
              key="diet"
              component={DietHistory}
              title="Diet"
              renderRightButton={this.newDiet} />

            <Scene key="newDiet" title="New Diet" component={NewDiet} />

            <Scene
              key="mealPlan"
              title="Client Diet"
              component={MealPlanContainer}
              leftButtonIconStyle={{tintColor:'white'}}
              titleStyle={{color:'white'}}
              onBack={() => {
                this.setBarStyle('dark-content', true);
                Actions.pop()
              }}
              navigationBarStyle={styles.mealPlanNavigationBar} />

            <Scene key="newClient" component={connect(mapStateToProps)(NewClient)} title="New Client" />
            <Scene key="ptClientMenu" component={PTClientMenu} title="" />
            <Scene key="clientProfile" component={ClientProfile} title="Profile" />
            <Scene key="tutorial" hideNavBar component={TutorialContainer} />
            <Scene key="login" hideNavBar initial={true} type="replace" component={LoginContainer} />
          </Scene>
        </Scene>
      </Router>
    )
  }
};

const styles = {
  mealPlanNavigationBar: {
    backgroundColor:'#13C7C8',
    borderColor: '#f8f8f8',
    borderBottomWidth: 0
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2DDDD'
  },
  tabBarSelectedItemStyle: {
  },
  signupNav: {
    flex: 1,
    backgroundColor: '#22BCED',
    borderColor: '#FFFFFF',
    borderBottomWidth: 0
  },
  signupNavTitleStyle: {
    color: '#FFFFFF'
  }
};

function mapStateToProps(state) {
  let { user, diet, currentClient, foods } = state;
  return {
    user,
    diet,
    foods,
    currentClient
  }
}

export default connect(mapStateToProps)(Routes)
