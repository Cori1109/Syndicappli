export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('token'));
  
    if (user) {
      return { Authorization: 'Bearer ' + user};
    } else {
      return {};
    }
}