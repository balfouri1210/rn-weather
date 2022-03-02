import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

export default function App() {
  const [city, setCity] = useState('...loading');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) setOk(false);

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=2087a5f26f686e7f530925775a933bae&units=metric`)
    const json = await response.json();
    console.log(json);
    setDays(json.daily);
  }

  const icons = {
    Clouds: 'cloudy',
    Clear: 'day-sunny',
    Atmosphere: '',
    Snow: 'snow',
    Rain: 'rains',
    Drizzle: 'rain',
    Thunderstorm: 'lightning'
  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.weather}
        horizontal
        pagingEnabled>
        {days.length === 0 ? <View style={styles.day}>
          <ActivityIndicator color="black" size="large" />
        </View> : (
          days.map((day, index) => (
            <View style={styles.day} key={index}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.temp}>{day.temp.day.toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={70} color="white" />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },

  city: {
    flex: 1,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cityName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white'
  },

  weather: {
    // flex: 2,
    backgroundColor: 'teal',
  },

  day: {
    width: Dimensions.get('window').width,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center'
  },

  temp: {
    fontSize: 120,
    fontWeight: 'bold',
    color: 'white'
  },

  description: {
    fontSize: 50,
    marginTop: -30,
    color: 'white'
  },

  tinyText: {
    fontSize: 16,
    color: 'white'
    // marginTop: 16
  }
});
