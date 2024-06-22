import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
    home: (props)=> <AntDesign name="home" size={26} {...props} />,
    explore: (props)=> <Feather name="compass" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
}