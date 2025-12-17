import React, { ReactElement } from "react";
import IconF from "react-native-vector-icons/Feather";
import IconA from "react-native-vector-icons/AntDesign";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import IconL from "react-native-vector-icons/MaterialIcons";
import IconN from "react-native-vector-icons/Ionicons";
import IconT from "react-native-vector-icons/FontAwesome";
import IconE from "react-native-vector-icons/EvilIcons";
import IconG from "react-native-vector-icons/Entypo";
import IconV from "react-native-vector-icons/FontAwesome5";
import IconP from "react-native-vector-icons/Foundation";
import IconFO from "react-native-vector-icons/Fontisto";
import IconO from "react-native-vector-icons/Octicons";

// interface iconType  {
// icon:  "Feather" | "AntDesign" | "MaterialCommunityIcons" | "MaterialIcons" | "Ionicons" | "FontAwesome" | "EvilIcons" | "Entypo" | "FontAwesome5" | "Foundation" | "Fontisto"
// }
 
interface IconProps {
  icon: string;
  name: string;
  color?: string;
  size?: number;
  style?: any;
  onPress?: any;
}
 
const Icon = ({ icon, name, color, size, style, onPress }: IconProps): ReactElement | null => {
  switch (icon) {
    case "Feather":
      return <IconF name={name} color={color} size={size} style={style} onPress={onPress} />;
    case "AntDesign":
      return <IconA name={name} color={color} size={size} style={style} />;
    case "MaterialCommunityIcons":
      return <IconM name={name} color={color} size={size} style={style} />;
    case "MaterialIcons":
      return <IconL name={name} color={color} size={size} style={style} />;
    case "Ionicons":
      return <IconN name={name} color={color} size={size} style={style} />;
    case "FontAwesome":
      return <IconT name={name} color={color} size={size} style={style} />;
    case "EvilIcons":
      return <IconE name={name} color={color} size={size} style={style} />;
    case "Entypo":
      return <IconG name={name} color={color} size={size} style={style} />;
    case "FontAwesome5":
      return <IconV name={name} color={color} size={size} style={style} />;
    case "Foundation":
      return <IconP name={name} color={color} size={size} style={style} />;
    case "Fontisto":
      return <IconFO name={name} color={color} size={size} style={style} />;
    case "Octicons":
      return <IconO name={name} color={color} size={size} style={style} />;
    default:
      return null;
  }
};
export default Icon;