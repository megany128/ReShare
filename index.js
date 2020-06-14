import _ from 'lodash';

// Checks if an offer's name or description contains the query
export const contains = ({name, description}, query) => {
    if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query))
    {
        return true;
    }
    return false;
};

// Checks if an offer's category matches the filter
export const categoryFilter = ({category}, filter) => {
    if (category === filter)
    {
        return true;
    }
    return false;
};

// Checks if an offer's location matches the filter
export const locationFilter = ({location}, filter) => {
    if (location === filter)
    {
        return true;
    }
    return false;
};

// Checks if an offer is by a certain author
export const byAuthor = ({author}, authorID) => {
    if (author === authorID)
    {
        return true;
    }
    return false;
};

// Checks if an offer is by anyone in a list of following
export const byFollowed = ({author}, following) => {
    for (var i = 0; i < following.length; i++) {
        if (author === following[i].uid)
        {
            return true;
        }
    }
    return false;
};