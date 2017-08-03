import * as React from 'react';
import * as Infinite from 'react-infinite';
import { observable, action, IObservableArray, computed } from 'mobx';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';

import './Datagrid.css';

@observer
export class DataGrid extends React.Component<{
    itemsSource: IObservableArray<any> | any[];
    onSelectRow: any;
    children?: any;
}, {}> {
    @observable headerTop: number = 0;
    @observable containerHeight: number = 600;

    container: HTMLElement | null;
    table: HTMLElement | null;
    table_header: HTMLElement | null;
    scrollContainer: HTMLElement | null;

    @action.bound
    setHeaderTop(top) {
        this.headerTop = top;
    }

    @action.bound
    setContainerHeight(height) {
        this.containerHeight = height;
    }

    @computed get rows() {
        return this.props.itemsSource.map((row, rowIndex) => {
            let cells = this.props.children.map((column, cellIndex) => (
                <div key={'cell-' + rowIndex + '-' + cellIndex}
                     className={classNames('table_column', (column.props.className || `col${(cellIndex + 1)}`))}>
                    {(column.props.cell && typeof column.props.cell === 'function')
                        ? column.props.cell(row)
                        : column.props.cell}
                </div>
            ));

            return (
                <div key={'row-' + rowIndex}
                     className={classNames('table_row')}
                     onClick={() => this.props.onSelectRow(row)}>
                    {cells}
                </div>
            );
        });
    }

    @computed get headings() {
        return this.props.children.map((column, cellIndex) => (
            <div key={'cell-' + cellIndex}
                 className={classNames('table_column', (column.props.className || `col${(cellIndex + 1)}`))}>
                {column.props.header()}
            </div>
        ));
    }

    bindTableElement = (div: HTMLDivElement)  => {
        this.table = div;
    };

    bindContainerElement = (div: HTMLDivElement) => {
        this.container = div;
        if (this.container) {
            this.setContainerHeight(this.container.getBoundingClientRect().height);
        }
    };

    bindTableHeader = (div: HTMLDivElement) => {
        this.table_header = div;
        if (this.table_header) {
            this.setHeaderTop(this.table_header.getBoundingClientRect().top);
        }
    };

    render() {
        let tableClassName = classNames('table');

        return (
            <div className={tableClassName} ref={this.bindTableElement}>
                <div className='table_row heading' ref={this.bindTableHeader}>
                    {this.headings}
                </div>
                <div className='table_content' ref={this.bindContainerElement}>
                    <Infinite
                        style={{flex: `1 1 ${this.containerHeight}px`}}
                        containerHeight={this.containerHeight}
                        elementHeight={64}
                        ref={(div) => this.scrollContainer = div}>
                        {this.rows}
                    </Infinite>
                </div>
            </div>
        );
    }
}

export class DataColumn extends React.Component<{
    header: (row?: any) => JSX.Element,
    cell: (row?: any) => JSX.Element,
    className?: string
}, {}> {
    render() {
        return (
            <div className={classNames('table_cell', (this.props.className || ''))}>
                {this.props.children}
            </div>
        );
    }
}

export class DataCell extends React.Component<{
    className?: string
}, {}> {
    render() {
        return (
            <div className={classNames('table_cell', (this.props.className || ''))}>
                {this.props.children}
            </div>
        );
    }
}
