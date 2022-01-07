const settings = require("../settings");
const formatDuration = require("format-duration");
const { tokenList, emojiList, emojiConvert, gemEmoji } = require("./emojis");

function messageCreator(type, args) {
	let msg;
	if (type == "token") {
		msg = `Collected ${args.amount} ${args.season} ${
			args.amount > 1 ? "tokens" : "token"
		}. ${tokenList[args.season]}\n`;
		if (settings.tokenAlerts.showTotal) {
			msg += `Session Total: ${args.stats.totalTokensEarnt.toLocaleString()} ${
				tokenList[args.season]
			}`;
		}
	} else if (type == "gems") {
		msg = `Earnt 50 gems ${emojiList.Gem_100}\n`;
		if (settings.gemAlerts.showTotal) {
			msg += `Session Total: ${args.stats.activityGems.toLocaleString()} ${gemEmoji(
				args.stats.activityGems
			)}`;
		}
	} else if (type == "message") {
		msg = args.message;
		if (msg.match(/[\W]/g)) {
			for (const emoji of msg.match(/[\W]/g)) {
				if (emojiConvert(emoji)) {
					msg = msg.replace(emoji, emojiConvert(emoji));
				}
			}
		}
	} else if (type == "marketSold") {
		msg = [
			`Buyer: ${args.buyer}`,
			`Gems Earnt: ${args.amount} ${gemEmoji(args.amount)}`,
		].join("\n");
		if (settings.marketAlerts.showTotal) {
			msg += `\nSession Total: ${args.stats.marketGems} ${gemEmoji(
				args.stats.marketGems
			)}`;
		}
	}else if (type == "marketOutbid") {
		msg = [
			`Outbid by: ${args.username}. New price ${args.amount} ${gemEmoji(args.amount)}`
		].join("\n");
	} else if (type == "exit") {
		let ratio = (
			args.stats.tokenTimesEarnt / args.stats.tokenMessages
		).toFixed(3);
		if (isNaN(ratio)) {
			ratio = 0;
		}
		msg = [
			`Session Time: ${formatDuration(
				args.stats.endTime - args.stats.startTime
			)}`,
			`Tokens Ratio: \`${args.stats.tokenTimesEarnt} : ${args.stats.tokenMessages}\` (${ratio})`,
			`Tokens Earnt: ${args.stats.totalTokensEarnt.toLocaleString()} ${
				args.stats.season ? tokenList[args.stats.season] : ""
			}`,
			`Activity Gems Earnt: ${args.stats.activityGems.toLocaleString()} ${gemEmoji(args.stats.activityGems)}`,
			`Market Gems Earnt: ${args.stats.marketGems.toLocaleString()} ${gemEmoji(args.stats.marketGems)}`,
			`Total Gems Earnt: ${args.stats.totalGems.toLocaleString()} ${gemEmoji(
				args.stats.totalGems
			)}`,
		].join("\n");
		if (settings.stats.goodnights) {
			msg += `\nGoodbyes Sent: ${args.stats.goodnights.toLocaleString()}`;
		}
	}
	return msg;
}

module.exports = { messageCreator };