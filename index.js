import _ from 'lodash';

export const contains = ({name, description}, query) => {
    if (name.includes(query) || description.includes(query)){
        return true;
    }
    return false;
};