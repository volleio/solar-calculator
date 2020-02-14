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
						overflow: hidden;
					}

					*::-webkit-scrollbar-track
					{
						-webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
						background-color: #F5F5F5;
					}

					*::-webkit-scrollbar
					{
						width: 8px;
						background-color: #F5F5F5;
					}

					*::-webkit-scrollbar-thumb
					{
					background-color: #555;
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
