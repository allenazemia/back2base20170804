import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';

// let styles = require('./AppNavBar.less');
import './AppNavBar.css';

export class AppNavBar extends React.Component<RouteComponentProps<any>, {}> {
    render() {
        const menuItems = [
            { label: 'Welcome', link: '/Welcome' },
            { label: 'State Management', link: '/State' },
            { label: 'Lifecycle', link: '/Lifecycle' },
            { label: 'List and Maps', link: '/List'},
            { label: 'People', link: '/people'}
        ];

        return (
            <div className={'navigationMenuBar'}>
                <div className={'navigationMenuLine'}>
                    <NavigationMenuBar navMenuItems={menuItems} />
                </div>
            </div>
        );
    }
}

class NavigationMenuRoot extends React.Component<RouteComponentProps<any> & {
    navMenuItems: any;
}, {}> {
    render() {
        return (
            <div className={'navigationMenuBarNav'}>
                {
                    this.props.navMenuItems.map((menuItem) =>
                        <div className={'navigationMenuBarNavItem'} key={menuItem.link}>
                            <NavLink to={menuItem.link}
                                     className={(this.props.location.pathname.startsWith(menuItem.link)) ? 'isActive' : ''}
                                     activeClassName={'isActive'}>
                                {menuItem.label}
                            </NavLink>
                        </div>
                    )
                }
            </div>
        );
    }
}

export const NavigationMenuBar = withRouter(NavigationMenuRoot);
