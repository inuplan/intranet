/// <reference path="../../typings/index.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'

ReactDOM.render(
    <Provider store={ {} } />
    , document.getElementById("content"));