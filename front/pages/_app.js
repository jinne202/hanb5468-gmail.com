import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import withRedux from 'next-redux-wrapper';
import reducer from '../reducers';
import rootSaga from '../sagas';

const NodeBird = ({ Component, store, pageProps }) => {
    return (
        // provider이 가장 최상위 부모라 그 아래 자식들이 provider에 접근할 수 있음
        <Provider store = {store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.9/antd.css"/>
                <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
            </Head>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </Provider>
    )
};


NodeBird.propTypes = {
    Component : PropTypes.elementType,
    store : PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};

// next에서 실행시켜주는 부분
NodeBird.getInitialProps = async (context) => {
    console.log(context);
    const { ctx, Component } = context;
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
};

// 고차 컴포넌트라고 부름 기존 component의 기능을 확장해준다. withRedux라는게 Nodebird component에 props로 store을 넣어주는 역할을 한다. 그 store을 어떻게 넣어줄지를 적어야 함
// 그냥 외우는게 좋다 어차피 모든 프로젝트에 다 똑같이 쓰인다
export default withRedux((initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    // 넣고싶은 미들웨어는 [] 여기 안에다가
    const middlewares = [sagaMiddleware];
    // 리덕스의 기능을 향상시키다 middleware을 apply해서!
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(
        applyMiddleware(...middlewares)
    )
    : compose(
        applyMiddleware(...middlewares),
        // typeof window !== 'undefined' 은 !options.isServer랑 같다
        // __REDUX_DEVTOOLS_EXTENSION__ 이거는 배포할때는 거의 뺀다 redux가 어떻게 돌아가는지 노출되어버림
        !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
    )
    const store = createStore(reducer, initialState, enhancer);
    sagaMiddleware.run(rootSaga);
    // 이 부분은 별로 바뀔 일이 없다 연결하는 부분!
    return store;
})(NodeBird);