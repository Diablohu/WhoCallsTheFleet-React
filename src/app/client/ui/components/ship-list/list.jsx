import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import {
    compareAdd,
    compareRemove
} from '@appLogic/ship-list/api.js'
import getShip from '@appUtils/get-ship.js'

import LinkShip from '@appUI/components/link/ship.jsx'

import { ImportStyle } from 'sp-css-import'
import styleList from './list.less'

@ImportStyle(styleList)
export default class ShipListList extends React.Component {
    insertPlaceHolders() {
        let i = 0;
        let arr = []
        while (i++ < 10) arr.push(<span className="item placeholder" key={i}></span>)
        return arr
    }

    renderItem(ship, index) {
        return (
            <ThisLink
                shipListId={this.props.id}
                ship={ship}
                key={index}

                onCompareSelect={this.props.onCompareSelect}
            />
        )
    }

    render() {
        // console.log(this.props.ships)
        return (
            <div className={this.props.className}>
                {this.props.ships.map(this.renderItem.bind(this))}
                {this.insertPlaceHolders()}
            </div>
        )
    }
}

@connect((state, ownProps) => ({
    isModeCompare: state.shipList[ownProps.shipListId].isModeCompare,
    compareList: state.shipList[ownProps.shipListId].compareList
}))
class ThisLink extends React.Component {
    onClick(evt, isSelected) {
        if (this.props.isModeCompare) {
            evt.preventDefault()
            if (isSelected) {
                this.props.dispatch(compareRemove(this.props.shipListId, this.props.ship))
            } else {
                this.props.dispatch(compareAdd(this.props.shipListId, this.props.ship))
            }
        }
    }

    shouldComponentUpdate(nextProps, /*nextState*/) {
        if (this.props.ship !== nextProps.ship) return true
        if (this.props.isModeCompare !== nextProps.isModeCompare) return true

        if (this.props.compareList.indexOf(this.props.ship) !== !nextProps.compareList.indexOf(this.props.ship)) return true
        else
            return false

        // return false
    }

    render() {
        const isSelected = (__CLIENT__ && this.props.isModeCompare && this.props.compareList.indexOf(this.props.ship) > -1) ? true : false
        // const className =
        //     "item"
        //     + (this.props.isModeCompare ? ' is-compare' : '')
        //     + (isSelected ? ' is-selected' : '')
        // console.log(this.props.ship._name, className)
        return (
            <LinkShip
                className={classNames([
                    'item',
                    {
                        'is-compare': this.props.isModeCompare,
                        'is-selected': isSelected
                    }
                ])}
                
                ship={this.props.ship}
                navy={true}
                name={true}
                pic={true}
                extraIllust={true}

                onClick={(evt) => this.onClick(evt, isSelected)}
            >
            </LinkShip>
        )
    }
}