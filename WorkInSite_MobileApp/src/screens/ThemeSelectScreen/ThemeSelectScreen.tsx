import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLanguage } from "../../context/LanguageContext";
import Header from "../../components/CommonComponets/Header/Header";
import Button from "../../components/CommonComponets/Button/Button";
import CustomAvatar from "../ProfileScreen/CustomAvatar";
import Icon from "../../utils/VectorIcons";
import { Colors } from "../../utils";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import RouteName from "../../navigation/RouteName";
import commonStyle from "../../styles/commonStyle";
import Style from "../../styles/ThemeSelectScreen";


const { width } = Dimensions.get("window");

const colorCombinations = [
  { primaryColor: "#F1C40F", secondaryColor: "rgb(79, 67, 15)" },
  { primaryColor: "#16A085", secondaryColor: "#1A1A1A" },
  { primaryColor: "#8E44AD", secondaryColor: "#1A1A1A" },
  { primaryColor: "#2ECC71", secondaryColor: "#1A1A1A" },
  { primaryColor: "#3B3B98", secondaryColor: "#0F0F0F" },
  { primaryColor: "#E74C3C", secondaryColor: "#2C3E50" },
  { primaryColor: "#D35400", secondaryColor: "#2C3E50" },
  { primaryColor: "#C0392B", secondaryColor: "#2C3E50" },
  { primaryColor: "#1ABC9C", secondaryColor: "#2C3E50" },
  { primaryColor: "#6C5CE7", secondaryColor: "#2C3E50" },
  { primaryColor: "#A3CB38", secondaryColor: "#2C3E50" },
  { primaryColor: "#E84393", secondaryColor: "#2D3436" },
  { primaryColor: "#2980B9", secondaryColor: "#2D3436" },
  { primaryColor: "#3498DB", secondaryColor: "#2D3436" },
  { primaryColor: "#FF6F61", secondaryColor: "#2D3436" },
  { primaryColor: "#00CEC9", secondaryColor: "#2D3436" },
  { primaryColor: "#F39C12", secondaryColor: "#34495E" },
  { primaryColor: "#E67E22", secondaryColor: "#34495E" },
  { primaryColor: "#9B59B6", secondaryColor: "#34495E" },
  { primaryColor: "#FF3F34", secondaryColor: "#1E272E" },
];

const dummyUsers = [
  { name: "Alice Johnson", phone: "123-456-7890", email: "alice@example.com" },
  { name: "Bob Smith", phone: "987-654-3210", email: "bob@example.com" },
  { name: "Charlie Brown", phone: "456-789-1234", email: "charlie@example.com" },
  { name: "David Miller", phone: "111-222-3333", email: "david@example.com" },
];

const ThemePreview = React.memo(
  ({ theme }: { theme: { primaryColor: string; secondaryColor: string } }) => {
    return (
      <View>
        <View style={[Style.previewCard, { backgroundColor: "#fff", gap: 8 }]}>
          <Header
            title="User Screen"
            onBackPress={() => { }}
            headerStyle={{ backgroundColor: theme.primaryColor }}
            rightNode={
              <Icon
                size={22}
                icon="AntDesign"
                name="pluscircle"
                color={theme.secondaryColor}
              />
            }
          />
          {dummyUsers.map((user, index) => (
            <View
              key={index}
              style={[Style.card, { borderColor: Colors.grayColor }]}
            >
              <CustomAvatar
                size={60}
                name={user.name}
                backgroundColor={theme.primaryColor}
                textColor={theme.secondaryColor}
              />
              <View style={Style.userInfo}>
                <Text style={[Style.name, { color: theme.secondaryColor }]}>
                  {user.name}
                </Text>
                <Text style={{ color: theme.secondaryColor }}>{user.phone}</Text>
                <Text style={{ color: theme.secondaryColor }}>{user.email}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
);

const ITEM_WIDTH = 60;

const ThemeSelectScreen = ({ navigation }: any) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectorRef = useRef<FlatList<any>>(null);
  const isFocused = useIsFocused();

  useFocusEffect(() => {
    if (!isFocused) setSelectedIndex(null);
    const onBackPress = () => {
      if (selectedIndex !== null) {
        setSelectedIndex(null);
        return true;
      }
      navigation.navigate(RouteName.PROFILE_SCREEN);
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  const applyTheme = () => {
    if (selectedIndex !== null) {
      setTheme(colorCombinations[selectedIndex]);
      StatusBar.setBackgroundColor(
        colorCombinations[selectedIndex].primaryColor,
        true
      );
      navigation.navigate(RouteName.SPLASH_SCREEN);
    }
  };

  const scrollSelectorToIndex = (index: number) => {
    if (!selectorRef.current) return;
    selectorRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 1, // item last la varum
    });
  };



  const handleGesture = (event: any) => {
    if (event.nativeEvent.state === 5 && selectedIndex !== null) {
      const { translationX } = event.nativeEvent;

      if (translationX < -50 && selectedIndex < colorCombinations.length - 1) {
        const newIndex = selectedIndex + 1;
        setSelectedIndex(newIndex);
        scrollSelectorToIndex(newIndex); // auto scroll
      } else if (translationX > 50 && selectedIndex > 0) {
        const newIndex = selectedIndex - 1;
        setSelectedIndex(newIndex);
        scrollSelectorToIndex(newIndex); // auto scroll
      }
    }
  };


  const renderBadge = (index: number) => {
    const isDefault = index === 0;
    const isUsing =
      JSON.stringify(theme) === JSON.stringify(colorCombinations[index]);

    if (isDefault || isUsing) {
      return (
        <View style={{ position: "absolute", top: -1, right: -4 }}>
          <View
            style={{
              backgroundColor: isDefault ? "#fff" : "#000",
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 2,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "700", color: isDefault ? "#000" : "#fff" }}>
              {isDefault ? "Default" : "Using"}
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };


  return (

    <View style={commonStyle.container}>
      <Header
        title="Customize Theme"
        onBackPress={() => {
          if (selectedIndex !== null) setSelectedIndex(null);
          else navigation.navigate(RouteName.PROFILE_SCREEN);
        }}
      />

      {/* Entire screen scrollable with equal spacing */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {selectedIndex === null ? (
          <View style={{ padding: 16 }}>
            <Text style={commonStyle.labelStyle}>{t("Choose a Theme")}</Text>
            <View style={Style.grid}>
              {colorCombinations.map((combo, index) => (
                <TouchableOpacity
                  key={index}
                  style={Style.colorCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedIndex(index)}
                >
                  <View style={Style.innerWrapper}>
                    <View style={[Style.block, { backgroundColor: combo.primaryColor }]} />
                    <View style={Style.secondarySplitRow}>
                      <View style={[Style.block, { backgroundColor: combo.secondaryColor }]} />
                      <View style={[Style.block, { backgroundColor: "#fff" }]} />
                    </View>
                  </View>
                  {renderBadge(index)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* swipeable preview */}
            <View style={{ width, padding: 28 }}>
              <PanGestureHandler onHandlerStateChange={handleGesture}>
                <View >
                  <ThemePreview theme={colorCombinations[selectedIndex]} />
                </View>
              </PanGestureHandler>
            </View>

            {/* Horizontal selector */}
            <FlatList
              ref={selectorRef}
              data={colorCombinations}
              horizontal
              style={{ marginVertical: 10 }}
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                const isSelected = selectedIndex === index;
                return (
                  <TouchableOpacity
                    style={{ marginHorizontal: 6, alignItems: "center" }}
                    onPress={() => {
                      setSelectedIndex(index);
                      scrollSelectorToIndex(index);
                    }}
                  >
                    <View
                      style={{
                        width: ITEM_WIDTH,
                        height: ITEM_WIDTH,
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <View style={{ flex: 1, backgroundColor: item.primaryColor }} />
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <View
                          style={{ flex: 1, backgroundColor: item.secondaryColor }}
                        />
                        <View style={{ flex: 1, backgroundColor: "#fff" }} />
                      </View>
                    </View>
                    {renderBadge(index)}
                    {isSelected && (
                      <View
                        style={{
                          height: 2,
                          width: 50,
                          backgroundColor: "black",
                          marginTop: 6,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <View
              style={{
                paddingHorizontal: 16,
                paddingTop: 10
              }}
            >
              <Button
                title="Use Me"
                onPress={applyTheme}
                buttonStyle={{
                  width: "88%",
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: Colors.grayColor,
                }}
              // variant="secondary"
              />
            </View>
          </>
        )}

      </ScrollView>
    </View>


  );
};

export default ThemeSelectScreen;