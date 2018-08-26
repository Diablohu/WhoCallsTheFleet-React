import React from 'react'

import { localeId } from 'koot'
import { ImportStyle } from 'sp-css-import'
import getSubtitle from '../get-subtitle'
// import db from '@api/database'

import Header from '@ui/components/main-header/infos'

@ImportStyle(require('./header.less'))
export default class EntityDetailsHeader extends React.Component {
    render() {
        if (!this.props.entity) return null

        const {
            className,
            entity,
            // ...props
        } = this.props

        let subtitle = getSubtitle(entity)

        return (
            <Header
                className={className}
                title={entity._name}
                subtitle={subtitle}
            >
                {localeId !== 'ja' && (
                    <span className="name-ja">{entity.getName('ja_jp')}</span>
                )}
            </Header>
        )
    }
}
