import React from 'react'
import { extend } from 'koot'

const ImprovementStar = extend({
    styles: require('./styles.less')
})(
    ({ star, level, lvl, children, ...props }) => (
        <span
            {...props}
            children={'★+' + (star || level || lvl || children)}
        />
    )
)

export default ImprovementStar
