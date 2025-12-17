// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
//   Image,
//   StyleSheet,
//   Linking,
// } from 'react-native';
// import Contacts, { Contact } from 'react-native-contacts';
// import { useTheme } from '../../../context/ThemeContext';
// import Modal from '../Model/Model';
// import Input from '../Input/input';

// type ContactListProps = {
//   onSelectContact: (name: string, phone: string) => void;
//   onClose: () => void;
// };

// const ContactList: React.FC<ContactListProps> = ({ onSelectContact, onClose }) => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
//   const [search, setSearch] = useState('');
//   const [noPermission, setNoPermission] = useState(false);
//   const { theme } = useTheme();

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         if (Platform.OS === 'android') {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_CONTACTS
//           );
//           if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             setNoPermission(true);
//             return;
//           }
//         }

//         const allContacts = await Contacts.getAll();
//         const validContacts = allContacts.filter(c => c.phoneNumbers?.length > 0);
//         setContacts(validContacts);
//         setFilteredContacts(validContacts);
//       } catch (error) {
//         console.error('Error fetching contacts:', error);
//       }
//     };

//     fetchContacts();
//   }, []);

//   const handleSearch = (text: string) => {
//     setSearch(text);
//     const filtered = contacts.filter(c =>
//       `${c.givenName} ${c.familyName}`.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredContacts(filtered);
//   };

//   const formatPhone = (phone: string) => {
//     const digits = phone?.replace(/\D/g, '') || '';
//     return digits.length > 10 ? digits.slice(-10) : digits;
//   };

//   const renderContact = ({ item }: { item: Contact }) => {
//     const name = `${item.givenName || ''} ${item.familyName || ''}`.trim();
//     const phone = formatPhone(item.phoneNumbers[0]?.number || '');
//     const initial = (item.givenName?.charAt(0) || '?').toUpperCase();

//     return (
//       <TouchableOpacity
//         style={s.card}
//         onPress={() => onSelectContact(name, phone)}
//         activeOpacity={0.7}
//       >
//         {item.hasThumbnail ? (
//           <Image source={{ uri: item.thumbnailPath }} style={s.avatar} />
//         ) : (
//           <View style={[s.avatar, s.placeholder, { backgroundColor: theme.primaryColor }]}>
//             <Text style={s.initial}>{initial}</Text>
//           </View>
//         )}
//         <View style={s.info}>
//           <Text style={s.name} numberOfLines={1}>{name}</Text>
//           <Text style={s.phone} numberOfLines={1}>{phone}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (noPermission) {
//     return (
//       <Modal
//         visible={true}
//         title="Contact Permission Required"
//         message="Enable contact access in settings to continue."
//         confirmText="Settings"
//         cancelText="Cancel"
//         onClose={() => {
//           setNoPermission(false);
//           onClose();
//         }}
//         onConfirm={() => {
//           Linking.openSettings();
//           onClose();
//         }}
//       />
//     );
//   }

//   return (
//     <View style={s.container}>
//       <View style={s.searchContainer}>
//         <Input
//           placeholder="Search contacts..."
//           value={search}
//           onChangeText={handleSearch}
//         />
//       </View>

//       {contacts.length ? (
//         <FlatList
//           data={filteredContacts}
//           keyExtractor={(item) => item.recordID}
//           renderItem={renderContact}
//           contentContainerStyle={s.list}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         />
//       ) : (
//         <View style={s.empty}>
//           <Text style={s.emptyText}>No contacts found</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const s = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//   },
//   list: {
//     padding: 8,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     marginBottom: 6,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   placeholder: {
//     backgroundColor: '#6366f1',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   initial: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   info: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   name: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   phone: {
//     fontSize: 13,
//     color: '#6b7280',
//   },
//   empty: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#9ca3af',
//   },
// });

// export default ContactList;



//2

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
  StyleSheet,
  Linking,
} from "react-native";

import Contacts, { Contact } from "react-native-contacts";
import { useTheme } from "../../../context/ThemeContext";
import Modal from "../Model/Model";
import Input from "../Input/input";
import debounce from "lodash.debounce";

type ContactListProps = {
  onSelectContact: (name: string, phone: string) => void;
  onClose: () => void;
};

const ContactList: React.FC<ContactListProps> = ({
  onSelectContact,
  onClose,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [noPermission, setNoPermission] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setNoPermission(true);
            return;
          }
        }

        // Faster: no images initially
        const allContacts = await Contacts.getAllWithoutPhotos();

        const valid = allContacts.filter((c) => c.phoneNumbers.length > 0);

        setContacts(valid);
        setFilteredContacts(valid);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const formatPhone = (phone: string) => {
    const digits = phone?.replace(/\D/g, "") || "";
    return digits.length > 10 ? digits.slice(-10) : digits;
  };

  const searchContacts = useCallback(
    debounce((text: string, all: Contact[]) => {
      const lower = text.toLowerCase();

      const filtered = all.filter((c) =>
        `${c.givenName} ${c.familyName}`.toLowerCase().includes(lower)
      );

      setFilteredContacts(filtered);
    }, 300),
    []
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    searchContacts(text, contacts);
  };

  const ContactItem = React.memo(
    ({ item }: { item: Contact }) => {
      const name = `${item.givenName || ""} ${item.familyName || ""}`.trim();
      const phone = formatPhone(item.phoneNumbers[0]?.number || "");
      const initial = item.givenName?.charAt(0)?.toUpperCase() ?? "?";

      return (
        <TouchableOpacity
          style={s.card}
          onPress={() => onSelectContact(name, phone)}
          activeOpacity={0.7}
        >
          <View
            style={[
              s.avatar,
              !item.hasThumbnail && s.placeholder,
              { backgroundColor: !item.hasThumbnail ? theme.primaryColor : undefined },
            ]}
          >
            {item.hasThumbnail ? (
              <Image source={{ uri: item.thumbnailPath }} style={s.avatar} />
            ) : (
              <Text style={s.initial}>{initial}</Text>
            )}
          </View>

          <View style={s.info}>
            <Text style={s.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={s.phone} numberOfLines={1}>
              {phone}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    (prev, next) => prev.item.recordID === next.item.recordID
  );

  const renderContact = useCallback(
    ({ item }: { item: Contact }) => <ContactItem item={item} />,
    []
  );

  if (noPermission) {
    return (
      <Modal
        visible={true}
        title="Contact Permission Required"
        message="Enable contact access in settings to continue."
        confirmText="Settings"
        cancelText="Cancel"
        onClose={() => {
          setNoPermission(false);
          onClose();
        }}
        onConfirm={() => {
          Linking.openSettings();
          onClose();
        }}
      />
    );
  }

  return (
    <View style={s.container}>
      <View style={s.searchContainer}>
        <Input
          placeholder="Search contacts..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      {contacts.length ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.recordID}
          renderItem={renderContact}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"

          // PERFORMANCE SETTINGS
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
        />
      ) : (
        <View style={s.empty}>
          <Text style={s.emptyText}>No contacts found</Text>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  list: {
    padding: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    borderRadius: 8,
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: "#6b7280",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});

export default ContactList;
