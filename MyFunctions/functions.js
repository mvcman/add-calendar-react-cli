const baseUrl = 'http://10.176.0.165:3001/';
// const baseUrl = 'localhost:3001/';
const fetchEvents = async () => {
  try {
    let data = await fetch(baseUrl + 'events');
    let m = await data.json();
    return m;
  } catch (err) {
    return err;
  }
};

const addEvent = async newEvent => {
  try {
    let data = await fetch(baseUrl + 'events', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });
    let m = await data.json();
    return m;
  } catch (err) {
    return err;
  }
};

const updateEvent = async newEvent => {
  try {
    let data = await fetch(baseUrl + 'events/' + newEvent.id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });
    let m = await data.json();
    return m;
  } catch (err) {
    return err;
  }
};

const deleteEvent = async id => {
  try {
    let data = await fetch(baseUrl + 'events/' + id, {
      method: 'DELETE',
    });
    let m = await data.json();
    return m;
  } catch (err) {
    return err;
  }
};

export {fetchEvents, addEvent, updateEvent, deleteEvent};
