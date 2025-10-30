import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarLabel: '홈',
        }}
      />
      <Tabs.Screen
        name="equalizing"
        options={{
          title: '이퀄라이징 훈련',
          tabBarLabel: '이퀄라이징',
        }}
      />
      <Tabs.Screen
        name="co2-table"
        options={{
          title: 'CO2 테이블 훈련',
          tabBarLabel: 'CO2 테이블',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
          tabBarLabel: '히스토리',
        }}
      />
    </Tabs>
  );
}
