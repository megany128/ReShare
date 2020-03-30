import _ from 'lodash';

export const contains = ({name, description}, query) => {
    if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query))
    {
        return true;
    }
    return false;
};