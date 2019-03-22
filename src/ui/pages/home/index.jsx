import React from 'react'
import Markdown from 'react-markdown'
import { extend } from 'koot'

import htmlHead from '@utils/html-head'

import Page from '@ui/containers/page'
import CenterContainer from '@ui/containers/center'

import Title from '@ui/components/title'
import Link from '@ui/components/link'

const markdownRenderers = {
    heading: (props) => {
        // console.log(props)
        let type
        if (props.level == 2) {
            type = "line-append"
        }
        return <Title type={type} {...props} />
    },
    Link: (props) => {
        return (
            props.href.match(/^(https?:)?\/\//)
                ? (props.href.indexOf('://') < 0
                    ? <a href={props.href}>{props.children}</a>
                    : <a href={props.href} target="_blank">{props.children}</a>
                )
                : <Link to={props.href}>{props.children}</Link>
        );
    }
}

const getMD = (localeId) => {
    if (localeId === 'en')
        return require(`@docs/updates/1.0.0/en.md`).default
    if (localeId === 'ja')
        return require(`@docs/updates/1.0.0/ja.md`).default
    return require(`@docs/updates/1.0.0/zh.md`).default
}

const PageHome = extend({
    connect: state => ({
        localeId: state.localeId
    }),
    pageinfo: (state) => htmlHead(state),
    styles: require('./styles.less')
})(
    ({ className, localeId }) => (
        <Page className={className}>
            <CenterContainer>
                <Markdown
                    source={getMD(localeId)}
                    renderers={markdownRenderers}
                    childAfter={
                        <span className="end-of-doc"></span>
                    }
                />
            </CenterContainer>
        </Page>
    )
)

export default PageHome
