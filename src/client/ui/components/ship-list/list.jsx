import React from 'react'

import pref from 'Logic/preferences'

import LinkShip from 'UI/components/link-ship.jsx'

import { ImportStyle } from 'sp-css-import'
import styleList from './list.less'

@ImportStyle(styleList)
export default class ShipListList extends React.Component {
    // getList() {
    //     let list = []
    // }
    insertPlaceHolders() {
        let i = 0;
        let arr = []
        while (i++ < 10) arr.push(<span className="item placeholder" key={i}></span>)
        return arr
    }

    checkLastRemodelLoop(ships, index) {
        while (ships[index].remodel && ships[index].remodel.next_loop)
            index++
        return index === ships.length - 1
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.ships.map((ships, index) => {
                    if (Array.isArray(ships))
                        return ships.map((ship, index2) => {
                            if (!this.props.showAll
                                && !pref.shipListShowAllShips
                                && index2 < ships.length - 1
                                && !this.checkLastRemodelLoop(ships, index2)
                            )
                                return null
                            return (<LinkShip className="item" ship={ship} key={index + '-' + index2} />)
                        })
                    return (<LinkShip className="item" ship={ships} key={index} />)
                })}
                {this.insertPlaceHolders()}
            </div>
        )
    }
}