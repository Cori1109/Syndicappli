import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout, Normal as NormalLayout} from './layouts';

import {
  Dashboard as DashboardView,
  Buildings as BuildingsView,
  Companies as CompaniesView,
  DiscountCodes as DiscountCodesView,
  Managers as ManagersView,
  Orders as OrdersView,
  Owners as OwnersView,
  Products as ProductsView,
  Users as UsersView,
  SignUp as SignUpView,
  NotFound,
} from './views/WebAppAdmin';
import {

  Team as TeamView,
  Buildings as ManagerBuildings,
  Owners as ManagerOwners,
  Addons as ManagerAddons,
  Assemblies as ManagerAssemblies,
  Events as ManagerEvents,
  Providers as ManagerProviders
} from './views/WebAppManager';
import {
  Addons as OwnerAddons,
  Assemblies as OwnerAssemblies,
  Events as OwnerEvents
} from './views/WebAppOwner';
//Admin import
import Login from './views/WebAppAdmin/SignIn/Login';
import CompaniesEdit from './views/WebAppAdmin/Companies/CompaniesEdit';
import ManagerEdit from './views/WebAppAdmin/Managers/ManagerEdit';
import UserEdit from './views/WebAppAdmin/Users/UserEdit';
import AdminMyAccount from './views/WebAppAdmin/MyAccount';
import ForgotPassword from 'views/WebAppAdmin/ForgotPassword';
import ResetPassword from 'views/WebAppAdmin/ResetPassword';
import SMSAuth from 'views/WebAppAdmin/SMSAuth';
import BuildingsEdit from 'views/WebAppAdmin/Buildings/BuildingsEdit';
import ProductsEdit from 'views/WebAppAdmin/Products/ProductsEdit';
import OwnerEdit from 'views/WebAppAdmin/Owners/OwnerEdit';
import OrderEdit from 'views/WebAppAdmin/Orders/OrderEdit';
import AdminHelp from 'views/WebAppAdmin/Help';
import DiscountCodesEdit from 'views/WebAppAdmin/DiscountCodes/DiscountCodesEdit';

//Manager import
import ManagerBuildingEdit from './views/WebAppManager/Buildings/BuildingsEdit';
import ManagerOwnerEdit from './views/WebAppManager/Owners/OwnerEdit';
import ManagerAssemblyEdit from './views/WebAppManager/Assemblies/AssemblyEdit';
import ManagerEventEdit from './views/WebAppManager/Events/EventEdit';
import ManagerProviderEdit from './views/WebAppManager/Providers/ProviderEdit';
import TeamMemberEdit from './views/WebAppManager/Team/TeamMemberEdit';
import ManagerHelp from 'views/WebAppManager/Help';
import ManagerInvoices from './views/WebAppManager/Informations/Invoices';
import ManagerMyAccount from './views/WebAppManager/Informations/MyAccount';
import ManagerMyCompany from './views/WebAppManager/Informations/MyCompany';
import ManagerPaymentMethods from './views/WebAppManager/Informations/PaymentMethods';
import ManagerAddonsPayment from './views/WebAppManager/Addons/ModulePayment';
import ManagerAssemblyDecisionEdit from './views/WebAppManager/Assemblies/views/Resolutions/EditResolution';

//Owner import
import OwnerInvoices from './views/WebAppOwner/Informations/Invoices';
import OwnerMyAccount from './views/WebAppOwner/Informations/MyAccount';
import OwnerSubAccounts from './views/WebAppOwner/Informations/SubAccounts';
import OwnerHelp from 'views/WebAppOwner/Help';
import OwnerAddonsPayment from './views/WebAppOwner/Addons/ModulePayment';
import AcceptInvitation from 'views/WebAppOwner/Informations/SubAccounts/AcceptInvitation';
import OwnerPaymentMethods from './views/WebAppOwner/Informations/PaymentMethods';
const Routes = () => {
  return (
    <Switch>
{/**
 * ADMIN PART
 */}
      <Redirect
        exact
        from="/"
        to={"/login"}
      />
      <RouteWithLayout
        component={Login}
        exact
        layout={NormalLayout}
        path="/login"
      />
      <RouteWithLayout
        component={SMSAuth}
        exact
        layout={NormalLayout}
        path="/smsauth"
      />
      <RouteWithLayout
        component={ForgotPassword}
        exact
        layout={NormalLayout}
        path="/forgotpassword"
      />
      <RouteWithLayout
        component={ResetPassword}
        exact
        layout={NormalLayout}
        path="/resetpassword"
      />
      <RouteWithLayout
        component={AdminMyAccount}
        exact
        layout={MainLayout}
        path="/admin/myaccount"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/admin/dashboard"
      />
      <RouteWithLayout
        component={BuildingsView}
        exact
        layout={MainLayout}
        path="/admin/buildings"
      />
      <RouteWithLayout
        component={BuildingsEdit}
        exact
        layout={MainLayout}
        path="/admin/buildings/edit/:id"
      />
      <RouteWithLayout
        component={UsersView}
        exact
        layout={MainLayout}
        path="/admin/users"
      />
      <RouteWithLayout
        component={UserEdit}
        exact
        layout={MainLayout}
        path="/admin/users/edit/:id"
      />
      <RouteWithLayout
        component={ProductsView}
        exact
        layout={MainLayout}
        path="/admin/products"
      />
      <RouteWithLayout
        component={ProductsEdit}
        exact
        layout={MainLayout}
        path="/admin/products/edit/:id"
      />
      <RouteWithLayout
        component={CompaniesView}
        exact
        layout={MainLayout}
        path="/admin/companies"
      />
      <RouteWithLayout
        component={CompaniesEdit}
        exact
        layout={MainLayout}
        path="/admin/companies/edit/:id"
      />
      <RouteWithLayout
        component={DiscountCodesView}
        exact
        layout={MainLayout}
        path="/admin/discountcodes"
      />
      <RouteWithLayout
        component={DiscountCodesEdit}
        exact
        layout={MainLayout}
        path="/admin/discountcodes/edit/:id"
      />
      <RouteWithLayout
        component={ManagersView}
        exact
        layout={MainLayout}
        path="/admin/managers"
      />
      <RouteWithLayout
        component={ManagerEdit}
        exact
        layout={MainLayout}
        path="/admin/managers/edit/:id"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/admin/register"
      />

      <RouteWithLayout
        component={OrdersView}
        exact
        layout={MainLayout}
        path="/admin/orders"
      />
      <RouteWithLayout
        component={OrderEdit}
        exact
        layout={MainLayout}
        path="/admin/orders/edit/:id"
      />
      <RouteWithLayout
        component={OwnersView}
        exact
        layout={MainLayout}
        path="/admin/owners"
      />
      <RouteWithLayout
        component={OwnerEdit}
        exact
        layout={MainLayout}
        path="/admin/owners/edit"
      />
      <RouteWithLayout
        component={AdminHelp}
        exact
        layout={MainLayout}
        path="/admin/help"
      />
{/**
 * OWNER PART
 */}
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/owner/dashboard"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/owner/incidents"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/owner/chat"
      />
      <RouteWithLayout
        component={OwnerAddons}
        exact
        layout={MainLayout}
        path="/owner/addons"
      />
      <RouteWithLayout
        component={OwnerAddonsPayment}
        exact
        layout={MainLayout}
        path="/owner/addons/payment"
      />
      <RouteWithLayout
        component={OwnerAssemblies}
        exact
        layout={MainLayout}
        path="/owner/assemblies"
      />
      <RouteWithLayout
        component={OwnerEvents}
        exact
        layout={MainLayout}
        path="/owner/events"
      />
      <RouteWithLayout
        component={OwnerMyAccount}
        exact
        layout={MainLayout}
        path="/owner/myaccount"
      />
      <RouteWithLayout
        component={OwnerInvoices}
        exact
        layout={MainLayout}
        path="/owner/invoices"
      />
      <RouteWithLayout
        component={OwnerSubAccounts}
        exact
        layout={MainLayout}
        path="/owner/subaccounts"
      />
      <RouteWithLayout
        component={OwnerPaymentMethods}
        exact
        layout={MainLayout}
        path="/owner/payment-methods"
      />
      <RouteWithLayout
        component={OwnerHelp}
        exact
        layout={MainLayout}
        path="/owner/help"
      />
      <RouteWithLayout
        component={AcceptInvitation}
        exact
        layout={NormalLayout}
        path="/invitation"
      />

{/** 
 * MANAGER PART
*/}      
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/manager/dashboard"
      />
      <RouteWithLayout
        component={TeamView}
        exact
        layout={MainLayout}
        path="/manager/team"
      />
      <RouteWithLayout
        component={TeamMemberEdit}
        exact
        layout={MainLayout}
        path="/manager/team/edit/:id"
      />
      <RouteWithLayout
        component={ManagerBuildings}
        exact
        layout={MainLayout}
        path="/manager/buildings"
      />
      <RouteWithLayout
        component={ManagerBuildingEdit}
        exact
        layout={MainLayout}
        path="/manager/buildings/edit/:id"
      />
      <RouteWithLayout
        component={ManagerOwners}
        exact
        layout={MainLayout}
        path="/manager/owners"
      />
      <RouteWithLayout
        component={ManagerOwnerEdit}
        exact
        layout={MainLayout}
        path="/manager/owners/edit"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/manager/chat"
      />
      <RouteWithLayout
        component={ManagerAddons}
        exact
        layout={MainLayout}
        path="/manager/addons"
      />
      <RouteWithLayout
        component={ManagerAddonsPayment}
        exact
        layout={MainLayout}
        path="/manager/addons/payment"
      />
      <RouteWithLayout
        component={ManagerAssemblies}
        exact
        layout={MainLayout}
        path="/manager/assemblies"
      />
      <RouteWithLayout
        component={ManagerAssemblyEdit}
        exact
        layout={MainLayout}
        path="/manager/assemblies/edit/:id"
      />
      <RouteWithLayout
        component={ManagerEvents}
        exact
        layout={MainLayout}
        path="/manager/events"
      />
      <RouteWithLayout
        component={ManagerEventEdit}
        exact
        layout={MainLayout}
        path="/manager/events/edit/:id"
      />
      <RouteWithLayout
        component={ManagerProviders}
        exact
        layout={MainLayout}
        path="/manager/providers"
      />
      <RouteWithLayout
        component={ManagerProviderEdit}
        exact
        layout={MainLayout}
        path="/manager/providers/edit/:id"
      />
      <RouteWithLayout
        component={ManagerMyAccount}
        exact
        layout={MainLayout}
        path="/manager/myaccount"
      />
      <RouteWithLayout
        component={ManagerMyCompany}
        exact
        layout={MainLayout}
        path="/manager/mycompany"
      />
      <RouteWithLayout
        component={ManagerInvoices}
        exact
        layout={MainLayout}
        path="/manager/invoices"
      />
      <RouteWithLayout
        component={ManagerPaymentMethods}
        exact
        layout={MainLayout}
        path="/manager/payment-methods"
      />
      <RouteWithLayout
        component={ManagerHelp}
        exact
        layout={MainLayout}
        path="/manager/help"
      />
      <RouteWithLayout
        component={NotFound}
        exact
        layout={NormalLayout}
        path="/not-found"
      />
      <RouteWithLayout
        component={ManagerAssemblyDecisionEdit}
        exact
        layout={MainLayout}
        path="/manager/assemblies/decision/edit/:id"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
