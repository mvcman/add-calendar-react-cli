import React, {Component} from 'react';
import moment from 'moment';
//Import React
import {
  View,
  Text,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import RNCalendarEvents from 'react-native-calendar-events';
import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from './MyFunctions/functions';
import LinearGradient from 'react-native-linear-gradient';
import {toISOFormat, toStringFormat} from './MyFunctions/formatDate';

function Separator() {
  return <View style={styles.separator} />;
}
console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      startDate: null,
      endDate: null,
      calendarId: '97',
      eventId: null,
      Calendars: [],
      allEvents: [],
      id: null,
      show: false,
      update: false,
    };
  }

  componentDidMount = async () => {
    await this.getPermissions();
    const data = await fetchEvents();
    if (!data.error) {
      await this.setState({
        allEvents: data,
      });
      console.log(this.state.allEvents);
    } else {
      Alert.alert('Something went wrong!');
    }
  };

  getPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
        {
          title: 'My demo Calendar',
          message:
            'Meeto Calendar app wants a permission to access your calendar!',
          buttonNegative: 'Cancel',
          buttonNeutral: 'Ask Me Later',
          buttonPositive: 'OK',
        },
        PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        {
          title: 'My demo Calendar',
          message:
            'Meeto Calendar app wants a permission to access your calendar!',
          buttonNegative: 'Cancel',
          buttonNeutral: 'Ask Me Later',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Calendar!');
        // Alert.alert('You can use the Calendar!');
      } else {
        console.log('Calendar permissoins denied!');
        Alert.alert('Calendar permissoins denied!');
      }
    } catch (err) {
      console.log(err);
    }
  };
  //functions are related to calendar
  addCalendar = async () => {
    let data = {
      title: 'MeetoCalendar',
      entityType: 'event',
      name: 'meeto',
      accessLevel: 'root',
      ownerAccount: 'mandar',
      source: {
        name: 'waghemandar@gmail.com',
        type: 'owner',
        isLocalAccount: true,
      },
      color: 'blue',
    };
    let calendaiId = await RNCalendarEvents.saveCalendar(data);
    console.log('Calendar added successfuly! and id is ', calendaiId);
    Alert.alert('Calendar added successfuly! id is ', calendaiId);
    this.setState({calendarId: calendaiId});
  };

  addEventToCalendar = async () => {
    // let startDate = moment(this.state.startDate || moment.now()).format(
    //   'YYYY-MM-DDTHH:mm:ss.SSS',
    // );
    // let enddate = moment(this.state.endDate || moment.now()).format(
    //   'YYYY-MM-DDTHH:mm:ss.SSS',
    // );
    // await this.addCalendar();
    let details = {
      calendarId: this.state.calendarId,
      startDate: toISOFormat(this.state.startDate),
      endDate: toISOFormat(this.state.endDate),
      location: 'Thane',
      notes: 'The error effect and all the day!',
      alarms: [{date: 5}, {date: 10}],
    };
    let options = {
      alarms: ['10'],
    };
    let eventId = await RNCalendarEvents.saveEvent(
      this.state.title,
      details,
      options,
    );
    console.log('Event added successfully! ', eventId);
    Alert.alert('Event is added successfuly! ', eventId);
    this.setState({
      eventId,
    });
    await this.addNewEvent();
  };

  updateEventToCalendar = async () => {
    let details = {
      id: this.state.eventId,
      calendarId: this.state.calendarId,
      startDate: toISOFormat(this.state.startDate),
      endDate: toISOFormat(this.state.endDate),
      location: 'dombivali123',
      alarms: [{date: 5}, {date: 10}],
      notes: 'The error effect and all the day!',
    };
    let eventId = await RNCalendarEvents.saveEvent(this.state.title, details);
    console.log('Event updated successfully! ', eventId);
    Alert.alert('Event updated successfuly! ', eventId);
    await this.updateAnEvent();
  };

  removeEventFromCalendar = async () => {
    let options = {
      calendarId: this.state.calendarId,
      startDate: toISOFormat(this.state.startDate),
      endDate: toISOFormat(this.state.endDate),
      location: 'dombivali123',
      alarms: [{date: 5}, {date: 10}],
      notes: 'The error effect and all the day!',
    };
    await RNCalendarEvents.removeEvent(this.state.eventId, options);
    console.log('Event Deleted Successfuly! ');
    Alert.alert('Event Deleted Successfuly! ');
    await this.removeEvent();
  };

  // functions for events related to db
  addNewEvent = async () => {
    let newEvent = {
      calendarId: this.state.calendarId,
      eventId: this.state.eventId,
      title: this.state.title,
      startDate: toISOFormat(this.state.startDate),
      endDate: toISOFormat(this.state.endDate),
    };
    let data = await addEvent(newEvent);
    // console.log('Event added to db successfully!', data);
    Alert.alert('Event Added successfuly! with id: ', JSON.stringify(data));
  };

  updateAnEvent = async () => {
    let newEvent = {
      id: this.state.id,
      calendarId: this.state.calendarId,
      eventId: this.state.eventId,
      title: this.state.title,
      startDate: toISOFormat(this.state.startDate),
      endDate: toISOFormat(this.state.endDate),
    };
    let data = await updateEvent(newEvent);
    // console.log('Event updated to db successfully!', data);
    Alert.alert('Event Updated successfuly! with id: ', JSON.stringify(data));
  };

  removeEvent = async () => {
    let id = this.state.id;
    let data = await deleteEvent(id);
    console.log('Event deleted from db successfully!', data);
    Alert.alert('Event deleted successfuly!');
  };

  getEventId(event) {
    this.setState({
      id: event.id,
      calendarId: event.calendarId,
      eventId: event.eventId,
      title: event.title,
      startDate: toStringFormat(event.startDate),
      endDate: toStringFormat(event.endDate),
      update: true,
    });
  }

  render() {
    // const MyEvents = allEvents.map((event, id) => <RenderEvents id={id} eventdata={event} getEventId={this.getEventId(event)} />);
    if (this.state.show) {
      return (
        <View>
          <TouchableOpacity onPress={() => this.setState({show: false})}>
            <Text>Back</Text>
          </TouchableOpacity>
          <View>
            <Text>{this.state.startDate}</Text>
            <Text>Start Date:- {this.state.startDate}</Text>
            <Text>End date:- {this.state.endDate}</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.setState({show: false, update: true})}>
            <Text>Update</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <ScrollView style={StyleSheet.container}>
          <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']}>
            <TextInput
              style={styles.input}
              value={this.state.title}
              placeholder="Enter title of event"
              onChangeText={text => this.setState({title: text})}
            />
            <Separator />
            <Text style={styles.text}>Select Start Date:- </Text>
            <DatePicker
              style={{margin: 20, width: '90%', height: 50}}
              date={this.state.startDate}
              mode="datetime"
              placeholder="select date and time"
              minDate="2017-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => this.setState({startDate: date})}
            />
            <Separator />
            <Text style={styles.text}>Select End Date:- </Text>
            <DatePicker
              style={{margin: 20, width: '90%', height: 50}}
              date={this.state.endDate}
              mode="datetime"
              placeholder="select date and time"
              minDate="2017-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => this.setState({endDate: date})}
            />
            <Separator />
            <View style={{padding: 20}}>
              {this.state.update ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={this.updateEventToCalendar}>
                    <Text style={styles.text2}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={this.removeEventFromCalendar}>
                    <Text style={styles.text2}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.addEventToCalendar}>
                  <Text style={styles.text2}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
            {this.state.allEvents.map(event => (
              <View style={{margin: 20}}>
                <TouchableOpacity
                  onPress={this.getEventId.bind(this, event)}
                  style={{
                    flex: 1,
                    height: 30,
                    borderRadius: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#283E73',
                    padding: 5,
                  }}>
                  <Text style={styles.text2}>{event.title}</Text>
                  <Text style={styles.text2}>{event.startDate}</Text>
                  <Text style={styles.text2}>{event.endDate}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </LinearGradient>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#192f6a',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  text: {
    color: '#283E73',
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20,
  },
  text2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20,
  },
  separator: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderBottomColor: 'blue',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#283E73',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  button1: {
    width: '46%',
    height: 50,
    backgroundColor: '#283E73',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
});
