import axios, { AxiosRequestHeaders } from 'axios'
import getConfig from 'next/config'
import { NextRequest } from 'next/server'
import { IncomingMessage } from 'http'
import Router from 'next/router'

let options = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin':'*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    },
}

// if is in server
if (typeof window === 'undefined') {
    // const {serverRuntimeConfig} = getConfig()
    options = Object.assign({}, options, {
        baseURL: 'http://localhost:8000',
    })
} else {
    options = Object.assign({}, options, {
        baseURL: 'http://localhost:8000/',
    })
}

const http = axios.create(options)

if(typeof window !== 'undefined') {
    // const {publicRuntimeConfig} = getConfig()
    http.interceptors.response.use(function (response) {
        return response
    }, async function (error) {
        if(error?.response?.status === '401') {
            await Router.push({
                pathname: `/login`,
                query: {clientId: 'skj', u: window.location.href}
            })
            await new Promise(resolve => setTimeout(resolve, 5e3))
        }
        return Promise.resolve(error)
    })
}

export default http

// using to append request header at server sid
