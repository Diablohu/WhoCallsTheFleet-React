import React from 'react'
// import { Link } from 'react-router'

import Remodels from './components/remodels.jsx'
import QuickFacts from './components/quickfacts.jsx'
import Stats from './components/stats.jsx'
import SlotEquipments from './components/slot-equipments.jsx'
import Illust from './components/illust.jsx'
import Modernization from './components/modernization.jsx'
import Dismantle from './components/dismantle.jsx'

// import translate from 'super-i18n'
// import db from '@appLogic/database'

import { ImportStyle } from 'sp-css-import'
import styles from './infos.less'

// @connect()
@ImportStyle(styles)
export default class ShipDetailsContentInfos extends React.Component {
    render() {
        return (
            <div className={this.props.className}>
                <Illust
                    ship={this.props.ship}
                    className="shipinfo shipinfo-illust"
                    // defaultIndex={this.props.illustIndex}
                    // onIndexChange={this.props.onIllustChange}
                />
                <QuickFacts ship={this.props.ship} className="shipinfo shipinfo-facts" />
                <Stats ship={this.props.ship} className="shipinfo shipinfo-stats" />
                <SlotEquipments ship={this.props.ship} className="shipinfo shipinfo-equipments" />
                <div className="shipinfo shipinfo-misc">
                    <Modernization ship={this.props.ship} className="shipinfo shipinfo-modernization" />
                    <Dismantle ship={this.props.ship} className="shipinfo shipinfo-dismantle" />
                </div>
                <Remodels ship={this.props.ship} className="shipinfo shipinfo-remodels" />
            </div>
        )
    }
}
