import React from 'react'
// import classNames from 'classnames'

import kckit from 'kckit'
const checkShip = kckit.check.ship
const checkAACI = kckit.check.aaci
const checkOASW = kckit.check.oasw
const checkOTS = kckit.check.ots

import db from '@appLogic/database'
import getEquipmentTypesFromCondition from '@appUtils/get-equipment-types-from-condition'

import ComponentContainer from '@appUI/containers/infos-component'
import Bullet from '@appUI/components/bullet'
import IconEquipment from '@appUI/components/icon-equipment'

import translate from 'sp-i18n'

const shipTypeRangeNormal = [
    ['BB', 3],
    ['CV', 1],
    ['CL', 2],
    ['CA', 2]
]

// import { ImportStyle } from 'sp-css-import'
// import styles from './combat-special.less'

// @connect()
// @ImportStyle(styles)
export default class ShipDetailsSpecialCombat extends React.Component {
    renderOASW() {
        const oaswTable = checkOASW(this.props.ship.id) || []
        const canAlways = oaswTable === true
        const canOASW = canAlways || (Array.isArray(oaswTable) && oaswTable.length) ? true : false
        return (
            <Bullet
                title={translate("combat_phases.oasw")}
                level={canOASW ? (canAlways ? 2 : 1) : 0}
            >
                {canOASW && canAlways && translate("ship_details.can_always_perform")}
                {canOASW && !canAlways && oaswTable.length > 1 && translate("ship_details.meet_one_requirements_below")}
                {canOASW && !canAlways && oaswTable.map((OASW, index) => {
                    const statsWithEquipments = []
                    let equipmentRequired = []
                    if (OASW.shipWithEquipments && OASW.shipWithEquipments.hasStat) {
                        for (let stat in OASW.shipWithEquipments.hasStat) {
                            if (this.props.ship.getAttribute(stat, this.props.ship_minLv) < OASW.shipWithEquipments.hasStat[stat])
                                statsWithEquipments.push([stat, OASW.shipWithEquipments.hasStat[stat]])
                        }
                    }
                    if (OASW.equipments) {
                        equipmentRequired = getEquipmentTypesFromCondition(OASW.equipments)
                        if (OASW.equipments.hasNameOf === '九三一空')
                            equipmentRequired.push('九三一空')
                    }
                    return (
                        <ul key={index} className="requirement">
                            {oaswTable.length > 1 && (`#${index + 1}`)}
                            {statsWithEquipments.map((stat, indexStat) => <li key={`${index}-${indexStat}`}>
                                {translate("require.ship_stat_with_equipments", {
                                    stat: translate(`stat.${stat[0]}`),
                                    value: stat[1]
                                })}
                            </li>)}
                            {equipmentRequired.map((type, indexType) => {
                                if (type === '九三一空')
                                    return (<li key={`${index}-${indexType}`}>
                                        {translate("require.equipment", { type: "" })}
                                        <IconEquipment className="equipment" icon={8}>
                                            九三一空
                                        </IconEquipment>
                                    </li>)
                                else
                                    return (<li key={`${index}-${indexType}`}>
                                        {translate("require.equipment_type", { type: "" })}
                                        <IconEquipment className="equipment" icon={db.equipmentTypes[type].icon}>
                                            {db.equipmentTypes[type]._name}
                                        </IconEquipment>
                                    </li>)
                            })}
                            {OASW.minLv && <li>{translate("require.min_possible_level", {
                                level: OASW.minLv || this.props.ship._minLv
                            })}</li>}
                        </ul>
                    )
                })}
            </Bullet>
        )
    }
    renderOTS() {
        const otsTable = checkOTS(this.props.ship.id) || []
        const canAlways = otsTable === true
        const canOTS = canAlways || (Array.isArray(otsTable) && otsTable.length) ? true : false
        return (
            <Bullet
                title={translate("combat_phases.ots")}
                level={canOTS ? (canAlways ? 2 : 1) : 0}
            >
                {canOTS && canAlways && translate("ship_details.can_always_perform")}
                {canOTS && !canAlways && otsTable.length > 1 && translate("ship_details.meet_one_requirements_below")}
                {canOTS && !canAlways && otsTable.map((OTS, index) => {
                    let equipmentRequired = []
                    if (OTS.equipments) {
                        equipmentRequired = getEquipmentTypesFromCondition(OTS.equipments)
                    }
                    return (
                        <ul key={index} className="requirement">
                            {otsTable.length > 1 && (`#${index + 1}`)}
                            {equipmentRequired.map((type, indexType) => <li key={`${index}-${indexType}`} data-type={type}>
                                {translate("require.equipment_type", { type: "" })}
                                <IconEquipment className="equipment" icon={db.equipmentTypes[type].icon}>
                                    {db.equipmentTypes[type]._name}
                                </IconEquipment>
                            </li>)}
                            {OTS.ship && OTS.ship.minLevel && <li>{translate("require.level", {
                                level: OTS.ship.minLevel
                            })}</li>}
                        </ul>
                    )
                })}
            </Bullet>
        )
    }
    renderRangeDifferent() {
        const pair = shipTypeRangeNormal.filter(arr => (
            this.props.ship.isType(arr[0]) && this.props.ship.stat.range != arr[1]
        ))
        if (Array.isArray(pair) && pair.length)
            return (
                <Bullet
                    title={translate("ship_details.range_different_title", { range: this.props.ship._range })}
                    level={this.props.ship.stat.range > pair[0][1] ? 2 : 1}
                >
                    {translate("ship_details.range_different_note", {
                        range: kckit.get.range(pair[0][1]),
                        type: db.shipTypes[this.props.ship.type_display]._name
                    })}
                </Bullet>
            )
        return null
    }
    render() {
        const isBattleship = this.props.ship.isType('battleship')
        const isCarrier = this.props.ship.isType('carrier')

        const statASW99 = this.props.ship.getAttribute('asw', 99)
        const statTorpedo99 = this.props.ship.getAttribute('torpedo', 99)

        const aaciTypes = checkAACI(this.props.ship.id)

        const canJetAssault = checkShip(this.props.ship, {
            isID: [
                461, // 翔鶴・改二
                466, // 翔鶴・改二甲
                462, // 瑞鶴・改二
                467, // 瑞鶴・改二甲
            ]
        })
        const canAACI = (Array.isArray(aaciTypes) && aaciTypes.length) ? true : false

        return (
            <ComponentContainer className={this.props.className} title={translate("ship_details.combat_special")}>
                {isCarrier && <Bullet
                    title={translate("combat_phases.jet")}
                    level={canJetAssault ? 1 : 0}
                >
                    {canJetAssault && translate("require.equipment_type", {
                        type: translate("equipment_types.jet")
                    })}
                </Bullet>}

                <Bullet
                    title={translate("aaci.title")}
                    level={canAACI ? 1 : 0}
                >
                    {canAACI && translate("ship_details.see_below_for_required_equipment_types")}
                </Bullet>

                {this.renderRangeDifferent()}

                {statASW99 !== false && statASW99 !== undefined && this.renderOASW()}
                {statASW99 === undefined && <Bullet
                    title={translate("combat_phases.oasw")}
                    level={-1}
                />}

                {statTorpedo99 !== false && this.renderOTS()}

                {isBattleship && statTorpedo99 !== false && <Bullet
                    title={translate("combat_phases.torpedo")}
                    level={2}
                />}

                {this.props.ship.type === 30 && <Bullet
                    title={translate("ship_details.light_attack_carrier_asw_title")}
                    level={2}
                >
                    {translate("ship_details.light_attack_carrier_asw_note")}
                </Bullet>}

                {isCarrier && <Bullet
                    title={translate("combat_phases.night")}
                    level={this.props.ship.additional_night_shelling ? 2 : 0}
                />}
            </ComponentContainer>
        )
    }
}