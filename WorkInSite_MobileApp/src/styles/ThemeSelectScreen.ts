import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  previewCard: {
    width: '100%',
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
  buttonGroup: {
    marginTop: 20,
    width: '100%',
  },
  colorCard: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  secondarySplitRow: {
    flexDirection: 'row',
    height: '50%',
  },
  block: {
    flex: 1,
  },
  togglePreviewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    borderBottomWidth: 1,
  },
  innerWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
