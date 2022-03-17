import axios from 'axios';
import authHeader from './authHeader';
const API_URL = process.env.REACT_APP_API_URL;
class AdminService {
  //LoginAs
  loginAs(data) {
    return axios.post(API_URL + 'auth/login_as', data, { headers: authHeader() });
  }
  //Login
  login(data) {
    return axios.post(API_URL + 'auth/login', data, {});
  }
  //firstLogin
  firstLogin(data) {
    return axios.post(API_URL + 'auth/firstLogin', data, {});
  }
  //verifySMS
  verifySMS(data) {
    return axios.post(API_URL + 'auth/verifySMS', data, {});
  }
  //forgotPassword
  forgotPassword(data) {
    return axios.post(API_URL + 'auth/forgotPassword', data, {});
  }
  //resetPassword
  resetPassword(data) {
    return axios.post(API_URL + 'auth/resetPassword', data, {});
  }
  //verifyToken
  verifyToken(data) {
    return axios.post(API_URL + 'auth/verifyToken', data, {});
  }
  //My Account
  updateProfile(data) {
    return axios.post(API_URL + 'web/admin/profile', data, { headers: authHeader() });
  }
  getProfile() {
    return axios.get(API_URL + 'web/admin/profile', { headers: authHeader() });
  }

  //User
  getUserList(data) {
    return axios.post(API_URL + 'web/admin/userList', data, { headers: authHeader() });
  }
  getUser(id) {
    return axios.get(API_URL + 'web/admin/user/' + id, { headers: authHeader() });
  }
  createUser(data) {
    return axios.post(API_URL + 'web/admin/user', data, { headers: authHeader() });
  }
  updateUser(id, data) {
    return axios.put(API_URL + 'web/admin/user/' + id, data, { headers: authHeader() });
  }
  deleteUser(id, status) {
    return axios.post(API_URL + 'web/admin/user/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashUser(status) {
    return axios.post(API_URL + 'web/admin/trash/user/deleteAll', status, { headers: authHeader() });
  }
  //Company Part
  getCompanyList(data) {
    return axios.post(API_URL + 'web/admin/companyList', data, { headers: authHeader() });
  }
  addCompany(data) {
    return axios.post(API_URL + 'web/admin/company', data, { headers: authHeader() });
  }
  updateCompany(id, data) {
    return axios.put(API_URL + 'web/admin/company/' + id, data, { headers: authHeader() });
  }
  getCompany(id) {
    return axios.get(API_URL + 'web/admin/company/' + id, { headers: authHeader() });
  }
  deleteCompany(id, status) {
    return axios.post(API_URL + 'web/admin/company/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashCompany(status) {
    return axios.post(API_URL + 'web/admin/trash/company/deleteAll', status, { headers: authHeader() });
  }
  updateBankInfo(id, data) {
    return axios.put(API_URL + 'web/admin/company/' + id + '/bank', data, { headers: authHeader() });
  }
  updateBuildingBankInfo(id, data) {
    return axios.put(API_URL + 'web/admin/building/' + id + '/bank', data, { headers: authHeader() });
  }
  //Card Part
  getCardList(data) {
    return axios.post(API_URL + 'web/admin/cardList', data, { headers: authHeader() });
  }
  createCard(data) {
    return axios.post(API_URL + 'web/admin/card', data, { headers: authHeader() });
  }
  updateCard(id, data) {
    return axios.put(API_URL + 'web/admin/card/' + id, data, { headers: authHeader() });
  }
  getCard(id) {
    return axios.get(API_URL + 'web/admin/card/' + id, { headers: authHeader() });
  }
  deleteCard(id) {
    return axios.delete(API_URL + 'web/admin/card/' + id, { headers: authHeader() });
  }
  //Building Part
  getBuildingList(data) {
    return axios.post(API_URL + 'web/admin/buildingList', data, { headers: authHeader() });
  }
  createBuilding(data) {
    return axios.post(API_URL + 'web/admin/building', data, { headers: authHeader() });
  }
  updateBuilding(id, data) {
    return axios.put(API_URL + 'web/admin/building/' + id, data, { headers: authHeader() });
  }
  getBuilding(id) {
    return axios.get(API_URL + 'web/admin/building/' + id, { headers: authHeader() });
  }
  deleteBuilding(id, status) {
    return axios.post(API_URL + 'web/admin/building/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashBuilding(status) {
    return axios.post(API_URL + 'web/admin/trash/building/deleteAll', status, { headers: authHeader() });
  }
  importBuilding(data) {
    return axios.post(API_URL + 'web/admin/building/import_csv', data, { headers: authHeader() });
  }
  exportBuilding(data) {
    return axios.post(API_URL + 'web/admin/building/export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Owner Part
  getOwnerList(data) {
    return axios.post(API_URL + 'web/admin/ownerList', data, { headers: authHeader() });
  }
  createOwner(data) {
    return axios.post(API_URL + 'web/admin/owner', data, { headers: authHeader() });
  }
  setSuspendOwner(id, data) {
    return axios.put(API_URL + 'web/admin/owner/' + id + '/status', data, { headers: authHeader() });
  }
  updateOwner(id, data) {
    return axios.put(API_URL + 'web/admin/owner/' + id, data, { headers: authHeader() });
  }
  getOwner(id, data) {
    return axios.post(API_URL + 'web/admin/owner/' + id, data, { headers: authHeader() });
  }
  deleteOwner(id, status) {
    return axios.post(API_URL + 'web/admin/owner/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashOwner(status) {
    return axios.post(API_URL + 'web/admin/trash/owner/deleteAll', status, { headers: authHeader() });
  }
  importOwner(data) {
    return axios.post(API_URL + 'web/admin/owner_import_csv', data, { headers: authHeader() });
  }
  exportOwner(data) {
    return axios.post(API_URL + 'web/admin/owner_export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Manager Part
  getManagerList(data) {
    return axios.post(API_URL + 'web/admin/managerList', data, { headers: authHeader() });
  }
  createManager(data) {
    return axios.post(API_URL + 'web/admin/manager', data, { headers: authHeader() });
  }
  updateManager(id, data) {
    return axios.put(API_URL + 'web/admin/manager/' + id, data, { headers: authHeader() });
  }
  getManager(id) {
    return axios.get(API_URL + 'web/admin/manager/' + id, { headers: authHeader() });
  }
  setSuspendManager(id, data) {
    return axios.put(API_URL + 'web/admin/manager/' + id + '/status', data, { headers: authHeader() });
  }
  deleteManager(id, status) {
    return axios.post(API_URL + 'web/admin/manager/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashManager(status) {
    return axios.post(API_URL + 'web/admin/trash/manager/deleteAll', status, { headers: authHeader() });
  }
  //DiscountCode Part
  getDiscountCodesList(data) {
    return axios.post(API_URL + 'web/admin/discountCodeList', data, { headers: authHeader() });
  }
  createDiscountCode(data) {
    return axios.post(API_URL + 'web/admin/discountCode', data, { headers: authHeader() });
  }
  updateDiscountCode(id, data) {
    return axios.put(API_URL + 'web/admin/discountCode/' + id, data, { headers: authHeader() });
  }
  getDiscountCode(id) {
    return axios.get(API_URL + 'web/admin/discountCode/' + id, { headers: authHeader() });
  }
  deleteDiscountCode(id, status) {
    return axios.post(API_URL + 'web/admin/discountCode/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashCode(status) {
    return axios.post(API_URL + 'web/admin/trash/discountCode/deleteAll', status, { headers: authHeader() });
  }
  //Product Part
  getProductList(data) {
    return axios.post(API_URL + 'web/admin/productList', data, { headers: authHeader() });
  }
  createProduct(data) {
    return axios.post(API_URL + 'web/admin/product', data, { headers: authHeader() });
  }
  updateProduct(id, data) {
    return axios.put(API_URL + 'web/admin/product/' + id, data, { headers: authHeader() });
  }
  getProduct(id) {
    return axios.get(API_URL + 'web/admin/product/' + id, { headers: authHeader() });
  }
  deleteProduct(id, status) {
    return axios.post(API_URL + 'web/admin/product/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashProduct(status) {
    return axios.post(API_URL + 'web/admin/trash/product/deleteAll', status, { headers: authHeader() });
  }
  //Order Part
  getOrderList(data) {
    return axios.post(API_URL + 'web/admin/orderList', data, { headers: authHeader() });
  }
  createOrder(data) {
    return axios.post(API_URL + 'web/admin/order', data, { headers: authHeader() });
  }
  updateOrder(id, data) {
    return axios.put(API_URL + 'web/admin/order/' + id, data, { headers: authHeader() });
  }
  getOrder(id) {
    return axios.get(API_URL + 'web/admin/order/' + id, { headers: authHeader() });
  }
  deleteOrder(id, status) {
    return axios.post(API_URL + 'web/admin/order/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashOrder(status) {
    return axios.post(API_URL + 'web/admin/trash/order/deleteAll', status, { headers: authHeader() });
  }
  downloadInvoiceCompany(data) {
    return axios.post(API_URL + 'web/admin/downloadInvoiceCompany', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadInvoiceBuilding(data) {
    return axios.post(API_URL + 'web/admin/downloadInvoiceBuilding', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadInvoiceOwner(data) {
    return axios.post(API_URL + 'web/admin/downloadInvoiceOwner', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadZipCompany(data) {
    return axios.post(API_URL + 'web/admin/downloadZipCompany', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadZipBuilding(data) {
    return axios.post(API_URL + 'web/admin/downloadZipBuilding', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadZipOwner(data) {
    return axios.post(API_URL + 'web/admin/downloadZipOwner', data, { headers: authHeader() ,responseType: 'blob'});
  }
  getBuyerList(data) {
    return axios.post(API_URL + 'web/admin/buyerList',data, { headers: authHeader() });
  }
  getBuyerList(data) {
    return axios.post(API_URL + 'web/admin/buyerList',data, { headers: authHeader() });
  }
  getCodeList(data) {
    return axios.post(API_URL + 'web/admin/discountCodeListByType',data, { headers: authHeader() });
  }
  //Common
  getBuildingListByCompany(data) {
    return axios.post(API_URL + 'web/admin/buildingListByCompany', data, { headers: authHeader() });
  }
  getCompanyListByUser() {
    return axios.get(API_URL + 'web/admin/companyListByUser', { headers: authHeader() });
  }
}
export class OwnerService {
  //My Account
  updateProfile(data) {
    return axios.post(API_URL + 'web/owner/profile', data, { headers: authHeader() });
  }
  getProfile() {
    return axios.get(API_URL + 'web/owner/profile', { headers: authHeader() });
  }
  //SubAccount Part
  getOwnerList(data) {
    return axios.post(API_URL + 'web/owner/subAccountList', data, { headers: authHeader() });
  }
  createOwner(data) {
    return axios.post(API_URL + 'web/owner/subAccount', data, { headers: authHeader() });
  }
  getOwner(id, data) {
    return axios.post(API_URL + 'web/owner/subAccount/' + id, data, { headers: authHeader() });
  }
  deleteOwner(id) {
    return axios.delete(API_URL + 'web/owner/subAccount/' + id, { headers: authHeader() });
  }
  reinviteOwner(id, data) {
    return axios.post(API_URL + 'web/owner/subAccount/' + id + '/reinvite', data, { headers: authHeader() });
  }
  acceptInvitation(data) {
    return axios.post(API_URL + 'web/owner/invitation', data, {});
  }
  getBuildingListByOwner() {
    return axios.get(API_URL + 'web/owner/buildingListByOwner', { headers: authHeader() });
  }
  //Payment Part
  //Card Part
  getCardList(data) {
    return axios.post(API_URL + 'web/owner/cardList', data, { headers: authHeader() });
  }
  createCard(data) {
    return axios.post(API_URL + 'web/owner/card', data, { headers: authHeader() });
  }
  updateCard(id, data) {
    return axios.put(API_URL + 'web/owner/card/' + id, data, { headers: authHeader() });
  }
  getCard(id) {
    return axios.get(API_URL + 'web/owner/card/' + id, { headers: authHeader() });
  }
  deleteCard(id) {
    return axios.delete(API_URL + 'web/owner/card/' + id, { headers: authHeader() });
  }
}

export class ManagerService {
  //My Account
  updateProfile(data) {
    return axios.post(API_URL + 'web/manager/profile', data, { headers: authHeader() });
  }
  getProfile() {
    return axios.get(API_URL + 'web/manager/profile', { headers: authHeader() });
  }
  //My Company
  updateMyCompany(data) {
    return axios.post(API_URL + 'web/manager/mycompany', data, { headers: authHeader() });
  }
  getMyCompany() {
    return axios.get(API_URL + 'web/manager/mycompany', { headers: authHeader() });
  }
  //Invoice Part
  getInvoiceSubscription(data) {
    return axios.post(API_URL + 'web/manager/invoice_order', data, { headers: authHeader() });
  }
  getInvoiceAddon(data) {
    return axios.post(API_URL + 'web/manager/invoice_addon', data, { headers: authHeader() });
  }
  downloadInvoiceSubscription(data) {
    return axios.post(API_URL + 'web/manager/downloadInvoiceOrder', data, { headers: authHeader() ,responseType: 'blob'});
  }
  downloadInvoiceAddon(data) {
    return axios.post(API_URL + 'web/manager/downloadInvoiceAddon', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Addon Part
  getAddonsByBuildingID(data) {
    return axios.post(API_URL + 'web/manager/addonsByBuildingID', data, { headers: authHeader() });
  }
  getAddon() {
    return axios.get(API_URL + 'web/manager/addon', { headers: authHeader() });
  }
  buyAddon(data) {
    return axios.post(API_URL + 'web/manager/buyAddon', data, { headers: authHeader() });
  }
  getDiscountCode(id) {
    return axios.get(API_URL + 'web/manager/discountCode/' + id, { headers: authHeader() });
  }
  getDiscountCodesList(data) {
    return axios.post(API_URL + 'web/manager/discountCodeListByType', data, { headers: authHeader() });
  }
  //Building Part
  getBuildingList(data) {
    return axios.post(API_URL + 'web/manager/buildingList', data, { headers: authHeader() });
  }
  createBuilding(data) {
    return axios.post(API_URL + 'web/manager/building', data, { headers: authHeader() });
  }
  updateBuilding(id, data) {
    return axios.put(API_URL + 'web/manager/building/' + id, data, { headers: authHeader() });
  }
  getBuilding(id) {
    return axios.get(API_URL + 'web/manager/building/' + id, { headers: authHeader() });
  }
  deleteBuilding(id, status) {
    return axios.post(API_URL + 'web/manager/building/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashBuilding(status) {
    return axios.post(API_URL + 'web/manager/trash/building/deleteAll', status, { headers: authHeader() });
  }
  importBuilding(data) {
    return axios.post(API_URL + 'web/manager/building/import_csv', data, { headers: authHeader() });
  }
  exportBuilding(data) {
    return axios.post(API_URL + 'web/manager/building/export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Owner Part
  getOwnerList(data) {
    return axios.post(API_URL + 'web/manager/ownerList', data, { headers: authHeader() });
  }
  createOwner(data) {
    return axios.post(API_URL + 'web/manager/owner', data, { headers: authHeader() });
  }
  updateOwner(id, data) {
    return axios.put(API_URL + 'web/manager/owner/' + id, data, { headers: authHeader() });
  }
  getOwner(id, data) {
    return axios.post(API_URL + 'web/manager/owner/' + id, data, { headers: authHeader() });
  }
  setSuspendOwner(id, data) {
    return axios.put(API_URL + 'web/manager/owner/' + id + '/status', data, { headers: authHeader() });
  }
  deleteOwner(id, status) {
    return axios.post(API_URL + 'web/manager/owner/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashOwner(status) {
    return axios.post(API_URL + 'web/manager/trash/owner/deleteAll', status, { headers: authHeader() });
  }
  importOwner(data) {
    return axios.post(API_URL + 'web/manager/owner_import_csv', data, { headers: authHeader() });
  }
  exportOwner(data) {
    return axios.post(API_URL + 'web/manager/owner_export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  //Team Part
  getTeamMemberList(data) {
    return axios.post(API_URL + 'web/manager/teamList', data, { headers: authHeader() });
  }
  createTeamMember(data) {
    return axios.post(API_URL + 'web/manager/team', data, { headers: authHeader() });
  }
  updateTeamMember(id, data) {
    return axios.put(API_URL + 'web/manager/team/' + id, data, { headers: authHeader() });
  }
  getTeamMember(id) {
    return axios.get(API_URL + 'web/manager/team/' + id, { headers: authHeader() });
  }
  setSuspendTeamMember(id, data) {
    return axios.put(API_URL + 'web/manager/team/' + id + '/status', data, { headers: authHeader() });
  }
  deleteTeamMember(id, status) {
    return axios.post(API_URL + 'web/manager/team/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashTeamMember(status) {
    return axios.post(API_URL + 'web/manager/trash/team/deleteAll', status, { headers: authHeader() });
  }
  //Common
  getCompanyListByUser() {
    return axios.get(API_URL + 'web/manager/companyListByUser', { headers: authHeader() });
  }
  getBuildingListByCompany(data) {
    return axios.post(API_URL + 'web/manager/owner_building_list', data, { headers: authHeader() });
  }
  //PaymentMethod Part
  //Card Part
  getCardList(data) {
    return axios.post(API_URL + 'web/manager/cardList', data, { headers: authHeader() });
  }
  createCard(data) {
    return axios.post(API_URL + 'web/manager/card', data, { headers: authHeader() });
  }
  updateCard(id, data) {
    return axios.put(API_URL + 'web/manager/card/' + id, data, { headers: authHeader() });
  }
  getCard(id) {
    return axios.get(API_URL + 'web/manager/card/' + id, { headers: authHeader() });
  }
  deleteCard(id) {
    return axios.delete(API_URL + 'web/manager/card/' + id, { headers: authHeader() });
  }
  //Bank Information Part
  updateBankInfo(id, data) {
    return axios.put(API_URL + 'web/manager/building/' + id + '/bank', data, { headers: authHeader() });
  }
  updateCompanyBankInfo(data) {
    return axios.put(API_URL + 'web/manager/bank', data, { headers: authHeader() });
  }
  //Event Part
  getEventList(data) {
    return axios.post(API_URL + 'web/manager/eventList', data, { headers: authHeader() });
  }
  createEvent(data) {
    return axios.post(API_URL + 'web/manager/event', data, { headers: authHeader() });
  }
  updateEvent(id, data) {
    return axios.put(API_URL + 'web/manager/event/' + id, data, { headers: authHeader() });
  }
  getEvent(id) {
    return axios.get(API_URL + 'web/manager/event/' + id, { headers: authHeader() });
  }
  deleteEvent(id, status) {
    return axios.post(API_URL + 'web/manager/event/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashEvent(status) {
    return axios.post(API_URL + 'web/manager/trash/event/deleteAll', status, { headers: authHeader() });
  }
  //Provider Part
  getProviderList(data) {
    return axios.post(API_URL + 'web/manager/providerList', data, { headers: authHeader() });
  }
  createProvider(data) {
    return axios.post(API_URL + 'web/manager/provider', data, { headers: authHeader() });
  }
  updateProvider(id, data) {
    return axios.put(API_URL + 'web/manager/provider/' + id, data, { headers: authHeader() });
  }
  getProvider(id) {
    return axios.get(API_URL + 'web/manager/provider/' + id, { headers: authHeader() });
  }
  deleteProvider(id, status) {
    return axios.post(API_URL + 'web/manager/provider/' + id + '/delete', status, { headers: authHeader() });
  }
  emptyTrashProvider(status) {
    return axios.post(API_URL + 'web/manager/trash/provider/deleteAll', status, { headers: authHeader() });
  }
  ///Decision Part
  getDecisionList(id, data) {
    return axios.post(API_URL + 'web/manager/assembly/DecisionList/' + id, data, { headers: authHeader() });
  }
  createDecision(data) {
    return axios.post(API_URL + 'web/manager/assembly/Decision', data, { headers: authHeader() });
  }
  updateDecision(id, data) {
    return axios.put(API_URL + 'web/manager/assembly/Decision/' + id, data, { headers: authHeader() });
  }
  getDecision(id) {
    return axios.get(API_URL + 'web/manager/assembly/Decision/' + id, { headers: authHeader() });
  }
  importAssemblyDecisions(data) {
    return axios.post(API_URL + 'web/manager/assembly/Decision/import_csv', data, { headers: authHeader() });
  }
  exportAssemblyDecisions(data) {
    return axios.post(API_URL + 'web/manager/assembly/Decision/export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  
  deleteDecision(id) {
    return axios.delete(API_URL + 'web/manager/assembly/Decision/' + id, { headers: authHeader() });
  }
  emptyTrashDecision(status) {
    return axios.post(API_URL + 'web/manager/assembly/Decision/deleteAll', status, { headers: authHeader() });
  }
  ///PostalVote Part
  getOwnerListForVote() {
    return axios.get(API_URL + 'web/manager/assembly/postalVote/OwnerList', { headers: authHeader() });
  }
  getPostalVoteList(data) {
    return axios.post(API_URL + 'web/manager/assembly/postalVoteList', data, { headers: authHeader() });
  }
  createPostalVote(data) {
    return axios.post(API_URL + 'web/manager/assembly/postalVote', data, { headers: authHeader() });
  }
  getPostalVoteDetail(id, data) {
    return axios.post(API_URL + 'web/manager/assembly/postalVoteDetail/' + id, data, { headers: authHeader() });
  }
  deletePostalVote(id, data) {
    return axios.post(API_URL + 'web/manager/assembly/postalVote/' + id, data, { headers: authHeader() });
  }
  emptyTrashPostalVotes(status) {
    return axios.post(API_URL + 'web/manager/assembly/postalVote/deleteAll', status, { headers: authHeader() });
  }
  //Assembly Part
  createAssembly(data) {
    return axios.post(API_URL + 'web/manager/assembly', data, { headers: authHeader() });
  }
  getAssemblyList(data) {
    return axios.post(API_URL + 'web/manager/assemblyList', data, { headers: authHeader() });
  }
  deleteAssembly(id) {
    return axios.delete(API_URL + 'web/manager/assembly/' + id, { headers: authHeader() });
  }
  getAssembly(id) {
    return axios.get(API_URL + 'web/manager/assembly/' + id, { headers: authHeader() });
  }
  updateAssembly(id, data) {
    return axios.put(API_URL + 'web/manager/assembly/' + id, data, { headers: authHeader() });
  }
  exportAssembly(data) {
    return axios.post(API_URL + 'web/manager/assembly/export_csv', data, { headers: authHeader() ,responseType: 'blob'});
  }
  importAssembly(data) {
    return axios.post(API_URL + 'web/manager/assembly/import_csv', data, { headers: authHeader() });
  }
  //Document Part
  createAssemblyFile(data) {
    return axios.post(API_URL + 'web/manager/assembly/File', data, { headers: authHeader() });
  }
  getAssemblyFiles(id) {
    return axios.get(API_URL + 'web/manager/assembly/FileList/' + id, { headers: authHeader() });
  }
  deleteAssemblyFile(id) {
    return axios.delete(API_URL + 'web/manager/assembly/File/' + id, { headers: authHeader() });
  }
}

export default new AdminService();