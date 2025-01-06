//save auth token to local storage
export const saveToken=(token)=>{
    localStorage.setItem('authToken', token)
};

//Get auth token from local storage
export const getToken=()=>{
    return localStorage.getItem('authToken');
};

//Remove token from local storage
export const removeToken=()=>{
    localStorage.removeItem('authToken');
};