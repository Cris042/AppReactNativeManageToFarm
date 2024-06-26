import React, { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, View, Switch, } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { Picker } from '@react-native-picker/picker';
import uuid from 'react-native-uuid';

import styles from "./styles";

interface DataRouteParams 
{
  position: 
  {
    latitude: number;
    longitude: number;
  };
}

interface Farms 
{
  id: number;
  name: string;
  size: number;
  countFood: number;
  latitude: number;
  longitude: number;
}

interface User
{
  id: string;
  name: string;
  email: string;
  isAdmin: number;
  avatar: string;
  token: string;
}

export default function Data() 
{
  const dataKey = '@appIF:Farm';
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as DataRouteParams;

  const [ name, setName ] = useState("");
  const [ size, setSize ] = useState("");
  const [ type, setType ] = useState("");
  const [ status, setStatus ] = useState( true );

  const [ farms , setFarms ] = useState<Farms[]>([]);
  const [ user, setUser ] = useState<User[]>([]);

  useEffect(() => 
  {

      async function loadPiket() 
      {
        const response = await AsyncStorage.getItem( dataKey );

        const responseFormatted = response ? JSON.parse( response ) : [];
        const expensives = responseFormatted;

        setFarms( expensives );  
      }

      async function load() 
      {
         const response = await AsyncStorage.getItem( '@appIF:User' );
  
         const responseFormatted = response ? JSON.parse( response ) : [];
         const expensives = responseFormatted;
  
         setUser( expensives );  
      }

      load();
      loadPiket();

  }, [ farms ]);

  async function handleCreateFarm( obj = {} )
  {
      try 
      {
        const data = await AsyncStorage.getItem( dataKey );
        const currentData = data ? JSON.parse( data ) : [];

        const dataFormatted = [
          ...currentData,
          obj
        ];

        await AsyncStorage.setItem( dataKey, JSON.stringify( dataFormatted ) );           
        navigation.navigate("Home" );

      } 
      catch ( error ) 
      {
        console.log( error );
      }

  }

  async function handleCreate() 
  {
      const amountOffood = 
      ( 
          type === "Braquiarão" ? 14000 : type === "Mombaça" ? 28000 : type === "Tanzania" ? 21000 : 
          type === "Tifton" ? 12600 : type === "Colonião" ? 12600 : 14000
      );

      const { latitude, longitude } = params.position; 
      const nameFarm = name === "" ? "Pasto " + Math.floor( Math.random() * 1000 + 256 ) : name;
      const farmsExistsAlert =  farms.find( farms => farms.name ===  name );

      const obj = 
      {
        id: String( uuid.v4() ),
        name:  nameFarm,
        countFood: String( amountOffood ),
        type: type === "" ? "Braquiarão" : String( type ),
        size: String( size ),
        latitude: String( latitude ),
        longitude: String( longitude ),
        status: String( status ),
        id_user: String( user[0]?.id ),
      }

      if( size !== "" && farmsExistsAlert?.id === undefined )       
         handleCreateFarm( obj );
      else
         alert( size === "" ? "Ops! O Campo : Tamanho do pasto e Obrigatorio" : "Ops! Ja existe um pasto com esse nome" );
        
   
  } 

  return (
    <ScrollView
      style = { styles.container }
      contentContainerStyle = {{ padding: 24 }}
    >
      <Text style = { styles.title }>Cadastro de Pasto</Text>

      <Text style = { styles.label}>Nome</Text>

      <TextInput 
         style = { styles.input } value = { name } 
         placeholder = "Nome do pasto ( O nome será gerado automaticamente caso deixer o campo vazio )" 
         onChangeText = { setName } 
      />

      <Text style = { styles.label }>Tamanho do Pasto ( hectares )</Text>

      <TextInput 
         style = { styles.input } value = { size }  
         keyboardType = "numeric"  
         placeholder = "Tamanho do pasto" 
         onChangeText = { setSize } 
      />

      <Text style = { styles.label }>Tipo</Text>

      <Picker mode = "dropdown"  
        selectedValue = { type }
        onValueChange = { ( itemValue, itemIndex ) =>
          setType( itemValue )
        }>

          <Picker.Item label = "Braquiarão" value = "Braquiarão" style = { styles.picker } />
          <Picker.Item label = "Mombaça" value = "Mombaça" style = { styles.picker } />
          <Picker.Item label = "Tanzania" value = "Tanzania" style = { styles.picker } />
          <Picker.Item label = "Tifton" value = "Tifton" style = { styles.picker } />
          <Picker.Item label = "Colonião" value = "Colonião" style = { styles.picker } />
       
      </Picker>

      <View style = { styles.switchContainer }>
        <Text style = { styles.label }>O pasto esta disponivel ?</Text>
        <Switch
          thumbColor = "#fff"
          trackColor = {{ false: "#ccc", true: "#39CC83" }}
          value = { status }
          onValueChange = { setStatus }
        />
      </View>
      
      <RectButton style = { styles.nextButton } onPress = { handleCreate }>
        <Text style = { styles.nextButtonText }>Cadastrar</Text>
      </RectButton>

    </ScrollView>
  );
}
