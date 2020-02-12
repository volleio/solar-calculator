import React, { Component } from 'react';

class Layout extends Component<ILayoutProps, ILayoutState> {
	constructor(props: ILayoutProps) {
		super(props);
	}

	public render() {
		return (
			<div className="layout">
				{this.props.children}
				<style jsx>
				{`
					@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400');
					.layout {
						font-family: 'Source Sans Pro', Arial, sans-serif;
					}
				`}
				</style>
				<style jsx global>
				{`
					*,
					*:before,
					*:after {
						box-sizing: border-box;
					}

					body {
						margin: 0;
					}
				`}
				</style>
			</div>
		);
	}

	public componentDidMount() {

    }
}

interface ILayoutProps {
	children: any;
}

interface ILayoutState {
}

export default Layout;
