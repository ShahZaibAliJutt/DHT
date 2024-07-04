// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [temperature, setTemperature] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('auth')) {
      router.push('/login');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const tempResponse = await fetch('http://<ESP32_IP_ADDRESS>/temperature', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password')
        }
      });
      const temp = await tempResponse.text();
      setTemperature(temp);

      const humResponse = await fetch('http://<ESP32_IP_ADDRESS>/humidity', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password')
        }
      });
      const hum = await humResponse.text();
      setHumidity(hum);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>DHT Sensor Data</h1>
      <p>Temperature: {temperature} °C</p>
      <p>Humidity: {humidity} %</p>
    </div>
  );
}
