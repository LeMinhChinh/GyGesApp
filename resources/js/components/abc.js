import React from 'react';
import { Card, Key, RangeSlider, Stack, TextField } from '@shopify/polaris';

export class DualThum extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			min: 0,
			max: 2000,
			prefix: '$',
			initialValue: [900, 1000],
			step: 10,
			intermediateTextFieldValue: [900, 1000],
			rangeValue: [900, 1000]
		};
		this.handleRangeSliderChange = this.handleRangeSliderChange.bind(this);
		this.handleLowerTextFieldChange = this.handleLowerTextFieldChange.bind(
			this
		);
		this.handleUpperTextFieldChange = this.handleUpperTextFieldChange.bind(
			this
		);
		this.handleLowerTextFieldBlur = this.handleLowerTextFieldBlur.bind(this);
		this.handleUpperTextFieldBlur = this.handleUpperTextFieldBlur.bind(this);
		this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
	}

	handleRangeSliderChange = (value) => {
		this.setState({ rangeValue: value, intermediateTextFieldValue: value });
	};

	handleLowerTextFieldChange = (value) => {
		this.setState({
			intermediateTextFieldValue: this.state.intermediateTextFieldValue.map(
				(item, index) => (index === 0 ? parseInt(value, 10) : item)
			)
		});
	};

	handleUpperTextFieldChange = (value) => {
		this.setState({
			intermediateTextFieldValue: this.state.intermediateTextFieldValue.map(
				(item, index) => (index === 1 ? parseInt(value, 10) : item)
			)
		});
	};

	handleLowerTextFieldBlur = (value) => {
		this.setState({
			rangeValue: [
				parseInt(this.state.rangeValue[1], 10),
				this.state.intermediateTextFieldValue[0]
			]
		});
	};

	handleUpperTextFieldBlur = (value) => {
		this.setState({
			rangeValue: [
				this.state.rangeValue[0],
				parseInt(this.state.intermediateTextFieldValue[1], 10)
			]
		});
	};

	handleEnterKeyPress = (event) => {
		let newValue = this.state.intermediateTextFieldValue;
		let oldValue = this.state.rangeValue;
		if (event.keyCode === Key.Enter && newValue !== oldValue) {
			this.setState({
				rangeValue: newValue
			});
		}
	};

	lowerTextFieldValue =
		this.state.intermediateTextFieldValue[0] === this.state.rangeValue[0]
			? this.state.rangeValue[0]
			: this.stateintermediateTextFieldValue[0];

	upperTextFieldValue =
		this.state.intermediateTextFieldValue[1] === this.state.rangeValue[1]
			? this.state.rangeValue[1]
			: this.state.intermediateTextFieldValue[1];

	render() {
		return (
			<Card sectioned title="Minimum requirements">
				<div onKeyDown={this.handleEnterKeyPress}>
					<RangeSlider
						output
						label="Money spent is between"
						value={this.staet.rangeValue}
						prefix={this.state.prefix}
						min={this.state.min}
						max={this.state.max}
						step={this.state.step}
						onChange={this.handleRangeSliderChange}
					/>
					<Stack distribution="equalSpacing" spacing="extraLoose">
						<TextField
							label="Min money spent"
							type="number"
							value={`${this.lowerTextFieldValue}`}
							prefix={this.state.prefix}
							min={this.state.min}
							max={this.state.max}
							step={this.state.step}
							onChange={this.handleLowerTextFieldChange}
							onBlur={this.handleLowerTextFieldBlur}
						/>
						<TextField
							label="Max money spent"
							type="number"
							value={`${this.upperTextFieldValue}`}
							prefix={this.state.prefix}
							min={this.state.min}
							max={this.state.max}
							step={this.state.step}
							onChange={this.handleUpperTextFieldChange}
							onBlur={this.handleUpperTextFieldBlur}
						/>
					</Stack>
				</div>
			</Card>
		);
	}
}
