import React from 'react';
// import classNames from 'classnames'
import { extend } from 'koot';
import kckit from 'kckit';

import db from '@database';
import getEquipmentTypesFromCondition from '@utils/get-equipment-types-from-condition';

import ComponentContainer from '@ui/containers/infos-component';
import Bullet from '@ui/components/bullet';
import IconEquipment from '@ui/components/icon-equipment';

import styles from './index.less';

import Legend from './legend';
import CombatRange from './range';
import JetAssult from './jet-assult';
import AerialFighter from './aerial-fighter';
import AerialBombing from './aerial-bombing';
import AAPropellantBarrage from './anti-air-propellant-barrage';
import OASW from './oasw';

const checkOTS = kckit.check.ots;

const { wrapper: moduleClassName } = styles;

//

const Combat = extend({
    styles
})(({ className, ship }) => (
    <ComponentContainer
        className={className}
        title={__('ship_details.combat_capabilities')}
    >
        <Legend />

        <CombatRange ship={ship} />

        <Section title={__('combat_phases.jet.title')}>
            <JetAssult ship={ship} />
        </Section>

        <Section title={__('combat_phases.aerial.title')}>
            <AerialFighter ship={ship} />
            <AerialBombing ship={ship} />
            <AAPropellantBarrage ship={ship} />
        </Section>

        <Section title={__('combat_phases.day.title')}>
            <OASW ship={ship} />
            {/* 开幕雷击 */}
            {/* 炮击 */}
            {/* 解锁第二轮炮击 */}
            {/* 雷击 */}
            <CapabilityOTS ship={ship} />
            <CapabilityTorpedo ship={ship} />
        </Section>

        <Section title={__('combat_phases.night.title')}>
            {/* 参与夜战 */}
            <CapabilityNightAirAssult ship={ship} />
            <CapabilityNoNightBattle ship={ship} />
        </Section>
    </ComponentContainer>
));
export default Combat;

//

const Section = ({ title, children }) => (
    <div className={`${moduleClassName}-section`}>
        <h4 className="title">{title}</h4>
        <div className="content">{children}</div>
    </div>
);

//

const CapabilityOTS = ({ ship }) => {
    const statTorpedo99 = ship.getAttribute('torpedo', 99);
    if (statTorpedo99 === false) return null;

    const otsTable = checkOTS(ship.id) || [];
    const canAlways = otsTable === true;
    const canOTS =
        canAlways || (Array.isArray(otsTable) && otsTable.length)
            ? true
            : false;
    return (
        <Bullet
            title={__('combat_phases.ots')}
            level={canOTS ? (canAlways ? true : 'indeterminate') : 0}
        >
            {canOTS && canAlways && __('ship_details.can_always_perform')}
            {canOTS &&
                !canAlways &&
                otsTable.length > 1 &&
                __('ship_details.meet_one_requirements_below')}
            {canOTS &&
                !canAlways &&
                otsTable.map((OTS, index) => {
                    let equipmentRequired = [];
                    if (OTS.equipments) {
                        equipmentRequired = getEquipmentTypesFromCondition(
                            OTS.equipments
                        );
                    }
                    return (
                        <ul key={index} className="requirement">
                            {otsTable.length > 1 && `#${index + 1}`}
                            {equipmentRequired.map((type, indexType) => (
                                <li
                                    key={`${index}-${indexType}`}
                                    data-type={type}
                                >
                                    {__('require.equipment_type', { type: '' })}
                                    <IconEquipment
                                        className="equipment"
                                        icon={db.equipmentTypes[type].icon}
                                    >
                                        {db.equipmentTypes[type]._name}
                                    </IconEquipment>
                                </li>
                            ))}
                            {OTS.ship && OTS.ship.minLevel && (
                                <li>
                                    {__('require.level', {
                                        level: OTS.ship.minLevel
                                    })}
                                </li>
                            )}
                        </ul>
                    );
                })}
        </Bullet>
    );
};

const CapabilityTorpedo = ({ ship }) => {
    const isBattleship = ship.isType('battleship');
    const statTorpedo99 = ship.getAttribute('torpedo', 99);
    if (!isBattleship || statTorpedo99 === false) return null;
    return <Bullet title={__('combat_phases.torpedo')} level={true} />;
};

const CapabilityNightAirAssult = ({ ship }) => {
    const isCarrier = ship.isType('carrier');
    if (!isCarrier) return null;

    const {
        count_as_night_operation_aviation_personnel,
        participate_night_battle_when_equip_swordfish
    } = ship.getCapability();

    if (count_as_night_operation_aviation_personnel) {
        const equipment = db.equipments[258]; // 夜間作戦航空要員
        return (
            <Bullet title={__('combat_phases.night_air_assault')} level={true}>
                {__('require.equipment_no_need', { type: '' })}
                <IconEquipment className="equipment" icon={equipment._icon}>
                    {equipment._name}
                </IconEquipment>
            </Bullet>
        );
    }

    if (ship.stat.fire || ship.stat.torpedo) {
        return (
            <Bullet title={__('combat_phases.night.title')} level={true}>
                {__('ship_details.carrier_default_night_battle')}
            </Bullet>
        );
    }

    if (participate_night_battle_when_equip_swordfish) {
        const equipment = db.equipments[242]; // Swordfish
        return (
            <Bullet
                title={__('combat_phases.night.title')}
                level="indeterminate"
            >
                {__('ship_details.carrier_swordfish_night_battle')}
                <br />
                {__('require.equipment', { type: '' })}
                <IconEquipment className="equipment" icon={equipment._icon}>
                    {__('equipment_series', {
                        equipment: equipment._name
                    })}
                </IconEquipment>
            </Bullet>
        );
    }

    return null;
};

const CapabilityNoNightBattle = ({ ship }) => {
    const isCarrier = ship.isType('carrier');
    if (isCarrier || ship.stat.fire + ship.stat.torpedo > 0) return null;
    return <Bullet title={__('combat_phases.night.title')} level={0} />;
};

// const Capability = ({ ship }) => {
//     return (
//         '1'
//     )
// }
