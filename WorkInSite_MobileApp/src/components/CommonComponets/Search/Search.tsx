import React from 'react';
import {
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Colors } from '../../../utils';
import { useLanguage } from '../../../context/LanguageContext';
import Icon from '../../../utils/VectorIcons';
import componentStyle from '../../../styles/componentStyle';
import commonStyle from '../../../styles/commonStyle';

interface SearchComponentProps {
    onSearch: () => void;
    onClear?: () => void;
    setSearch?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    onSearch,
    onClear,
    setSearch = '',
}) => {
    const { t } = useLanguage();

    return (
        <TouchableOpacity
            style={componentStyle.searchContainer}
            onPress={onSearch}
            activeOpacity={0.8}
        >
            {/* Search Icon */}
            <Icon icon="MaterialIcons" name="search" size={24} color={Colors.grayColor} style={componentStyle.typeIconRightSpacing} />

            {/* Dynamic Search Content or Prompt */}
            {setSearch !== "Search" ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={commonStyle.flex}
                >
                    <Text style={componentStyle.searchResultText}>{setSearch}</Text>
                </ScrollView>
            ) : (
                <Text style={componentStyle.searchInputText}>{t('Search')}</Text>
            )}

            {/* Clear Button */}
            {setSearch !== "Search" && (
                <TouchableOpacity onPress={onClear}>
                    <Icon icon="MaterialIcons" name="cancel" size={24} color={Colors.grayColor} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default SearchComponent;