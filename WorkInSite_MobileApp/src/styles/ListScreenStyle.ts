import {StyleSheet} from 'react-native';
import {Colors} from '../utils';

export default StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: Colors.grayColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 6,
  },
  ListContentContainer: {
    padding: 20,
  },
  listContainer: {
    paddingBottom: 150,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.grayColor,
    fontSize: 16,
    marginTop: 20,
  },
  actionIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    alignItems: 'center',
  },
});
