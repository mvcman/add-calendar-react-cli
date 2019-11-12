import React, {Component} from 'react';
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
} from 'react-native';
//Import basic react native components
import MultiSelect from 'react-native-multiple-select';
//Import MultiSelect library
import RNCalendarEvents from 'react-native-calendar-events';

const RenderCalendar = ({calendar, click}) => {
  return (
    <View style={{marginVertical: 5}}>
      <TouchableOpacity
        style={styles.calendar}
        onPress={() => click(calendar.id)}>
        <Text style={styles.text}>mandar</Text>
        <Text style={styles.text}>waghe</Text>
        <Text style={styles.text}>{calendar.title}</Text>
        <Text style={styles.text}>{calendar.source}</Text>
      </TouchableOpacity>
    </View>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendars: [],
      calendarId: '',
    };
  }

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
        Alert.alert('You can use the Calendar!');
      } else {
        console.log('Calendar permissoins denied!');
        Alert.alert('Calendar permissoins denied!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  findAllCalendars = async () => {
    // const startDate = new Date(Date.parse('2019-12-02T05:00:00'));
    // const endDate = new Date(Date.parse('2019-12-02T06:00:00'));
    await this.getPermissions();
    let st = await RNCalendarEvents.authorizeEventStore();
    console.log(st);
    let data = await RNCalendarEvents.findCalendars();
    // let data = await RNCalendarEvents.saveEvent('title123', {
    //   calendarId: '90',
    //   startDate,
    //   endDate
    // });
    this.setState({calendars: data});
    console.log('status of result: ', JSON.stringify(data));
    // let status = RNCalendarEvents.authorizationStatus();
    // console.log("My status ", status);
    // let data= await RNCalendarEvents.findCalendars();
    // const calendar = {
    //   title: 'My demo meeto',
    //   startDate: new Date(Date.parse('2019-12-02T05:00:00')),
    //   endDate: new Date(Date.parse('2019-12-02T05:00:00')),
    //   location: 'Thane'
    // }
    // let data = await RNCalendarEvents.saveCalendar(calendar);
    // console.log('Data: ', data);
  };

  fetchAllevents = async () => {
    const startDate = '2018-01-01T05:00';
    const endDate = '2019-12-01T05:00';
    let data = await RNCalendarEvents.fetchAllEvents(startDate, endDate, [
      '85',
      '86',
      '87',
      '88',
      '89',
      '90',
    ]);
    console.log('All events: ', data);
  };

  addEvent = async () => {};

  addCalendar = async () => {
    let data = {
      title: 'metooooooooooo',
      entityType: 'event',
      name: 'metotototo',
      accessLevel: 'root',
      ownerAccount: 'mandar',
      source: {
        name: 'waghemandar@gmail.com',
        type: 'owner',
        isLocalAccount: true,
      },
      color: 'gray',
    };
    let calendaiId = await RNCalendarEvents.saveCalendar(data);
    console.log('Calendar added successfuly! and id is ', calendaiId);
    Alert.alert('Calendar added successfuly! id is ', calendaiId);
    this.setState({calendarId: calendaiId});
  };

  addEvent = async () => {
    let details = {
      calendarId: '91',
      startDate: '2019-12-05T05:00:00.00Z',
      endDate: '2019-12-06T05:00:00.000Z',
      location: 'Thane',
      notes: 'The error effect and all the day!',
    };

    let options = {
      alarms: ['10'],
    };

    let eventId = await RNCalendarEvents.saveEvent(
      'mandar birthday!',
      details,
      options,
    );
    console.log('Event added successfully! ', eventId);
    Alert.alert('Event is added successfuly! ', eventId);
  };

  updateEvent = async () => {
    let details = {
      id: '344',
      calendarId: '91',
      startDate: '2019-12-05T05:00:00.00Z',
      endDate: '2019-12-05T05:00:00.000Z',
      location: 'dombivali123',
      notes: 'The error effect and all the day!',
    };

    let eventId = await RNCalendarEvents.saveEvent(
      'mandar birthday done 123!',
      details,
    );
    console.log('Event updated successfully! ', eventId);
    Alert.alert('Event updated successfuly! ', eventId);
  };

  removeEvent = async () => {
    let options = {
      calendarId: '91',
      startDate: '2019-12-05T05:00:00.00Z',
      endDate: '2019-12-05T05:00:00.000Z',
      location: 'dombivali123',
      notes: 'The error effect and all the day!',
    };
    await RNCalendarEvents.removeEvent('344', options);
    console.log('Event Deleted Successfuly! ');
    Alert.alert('Event Deleted Successfuly! ');
  };

  clicked(id) {
    Alert.alert('Event Clicked id: ', id);
  }

  render() {
    const allCalendars = this.state.calendars.map(calendar => (
      <RenderCalendar
        calendar={calendar}
        click={this.clicked.bind(this, calendar.id)}
      />
    ));
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={this.findAllCalendars}>
          <Text style={styles.text}>Find All calendars</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.addEvent}>
          <Text style={styles.text}>Add Event to calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.fetchAllevents}>
          <Text style={styles.text}>Fetch all events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.addCalendar}>
          <Text style={styles.text}>Add calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.updateEvent}>
          <Text style={styles.text}>update to calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this.removeEvent}>
          <Text style={styles.text}>remove event</Text>
        </TouchableOpacity>
        {allCalendars}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 20,
  },
  btn: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginVertical: 5,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'red',
    marginVertical: 5,
    padding: 5,
    height: 'auto',
  },
  text: {
    fontSize: 12,
    color: 'white',
  },
});
export default App;
