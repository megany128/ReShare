if(__DEV__) {
    import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
  }
import _ from 'lodash';

export const contains = ({name, description}, query) => {
    if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query))
    {
        return true;
    }
    return false;
};

export const categoryFilter = ({category}, filter) => {
    console.log('category: ' + category)
    console.log('filter: ' + filter)
    if (category === filter)
    {
        return true;
    }
    return false;
};

export const locationFilter = ({location}, filter) => {
    console.log('location: ' + location)
    console.log('filter: ' + filter)
    if (location === filter)
    {
        return true;
    }
    return false;
};