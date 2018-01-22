/**
 * 
 * @param year
 *            年
 * @param month
 *            月
 * @param day
 *            日
 * @param td_time
 *            当前时间戳
 * @param week
 *            本月1号周几
 * @param days
 *            本月天数
 * @param lastmonth_days
 *            上月天数
 */
// 日历开始
var date = new Date(); // 定义一个日期对象；
var nowyear = date.getFullYear(); // 获取当前年份；
var nowmonth = date.getMonth() + 1; // 获取当前月份；
var nowday = date.getDate(); // 获取当前日期；
var mowtime = new Date(nowyear, nowmonth, nowday).getTime();
var nowtime_7 = new Date(nowyear, nowmonth, nowday + 7).getTime();
$(function() {
	// 回填数据
	$('.year').text(nowyear);
	$('.month').text(nowmonth);
	initform(nowyear, nowmonth);
	
	// 下一月；
	$('.next').click(function() {
		next();
	});

	// 上一月；
	$('.prev').click(function() {
		prev();
	});

	// 返回本月；
	$('.tomon').click(function() {
		initform(nowyear, nowmonth);
		$('.year').text(nowyear);
		$('.month').text(nowmonth);
	});

});

function initform(year, month) {

	// 计算本月1号是周几；
	var week = new Date(year + '-' + month + '-1').getDay();

	// 计算本月有多少天；
	var days = new Date(year, month, 0).getDate();

	// 计算上月有多少天；
	var lastmonth_days = new Date(year, month - 1, 0).getDate();

	// 将日历填回页面
	var html = '';
	for (var i = 1; i <= days; i++) {
		var _time = new Date(year, month, i).getTime();
		html += "<li data-jr=" + month + "-" + i + " data-id=" + _time
				+ " data-date=" + year + "-" + month + "-" + i + ">"
				+ "<div id='iswork" + i + "' class='div-left'></div>"
				+ "<div class='div-middle'>"
				+ "<p><input disabled type='checkbox' id='breakfast"
				+ (i - nowday + 1) + "'/>早餐</p>"
				+ "<p><input disabled type='checkbox' id='lunch"
				+ (i - nowday + 1) + "'/>午餐</p>" + "</div>"
				+ "<div class='div-right'>" + i + "</div>" + "</li>"
	}

	// 调用节假日接口
	var ym = year + PrefixInteger(month, 2);
	$.ajax({
		url : "http://www.easybots.cn/api/holiday.php?m=" + ym,
		type : 'post',
		success : function(json) {
			$('.date ul').html(html);
			var holiday = JSON.parse(json)[ym];
			var isholiday = "";
			// 日历里面时间戳跟当前时间戳比较；大于等于 可点击；小于不可点击；日期默认单选
			for (var k = 0; k < days; k++) {
				if (holiday[PrefixInteger(k + 1, 2)]) {
					$('#iswork' + (k + 1)).html("休");
				} else {
					$('.date ul li').eq(k).addClass('no_wk');
				}
				var tt_time = $('.date ul li').eq(k).attr('data-id');
				var num = 0;
				var wk = new Date($('.date ul li').eq(k).attr('data-date'))
						.getDay();
				if (tt_time >= mowtime && tt_time < nowtime_7) {
					// 判断是否是周六或周日；添加特殊样式
					if (wk == 6 || wk == 0) {
						$('.date ul li .div-left').eq(k).addClass('act_wk');
						$('.date ul li .div-right').eq(k).addClass('act_wk')
					}
					if (tt_time == mowtime) {
						$('.date ul li').eq(k).addClass('act_date');
					}
					// 设置可以选择的复选框
					$('#breakfast' + (k - nowday + 2)).removeAttr("disabled");
					$('#lunch' + (k - nowday + 2)).removeAttr("disabled");
					// $('.date ul li').eq(k).click(function() {
					// var _this = $(this);
					// _this.addClass('act_date'); // 选择开始日期
					// _this.siblings('li').removeClass('act_date');
					// var dr = _this.attr('data-date');
					// });
				} else {
					$('.date ul li').eq(k).addClass('no_date');
				}
			}
			// 计算前面空格键；
			var html2 = '';
			for (var j = lastmonth_days - week + 1; j <= lastmonth_days; j++) {
				html2 += "<li class='no_date'></li>";
			}
			$('.date ul li').eq(0).before(html2);

			// 计算后面空格键；
			var html3 = '';
			for (var x = 1; x < 43 - days - week; x++) {
				html3 += "<li class='no_date'></li>";
			}
			$('.date ul li').eq(days + week - 1).after(html3);
		}
	});

}

// 下一月；
function next() {
	var y = $('.year').text();
	var m = $('.month').text();
	if (m == 12) {
		y++;
		m = 1;
	} else {
		m++;
	}
	$('.year').text(y);
	$('.month').text(m);
	initform(y, m)
}
// 上一月；
function prev() {
	var y = $('.year').text();
	var m = $('.month').text();
	if (m == 1) {
		y--;
		m = 12;
	} else {
		m--;
	}
	$('.year').text(y);
	$('.month').text(m);
	initform(y, m)
}
function PrefixInteger(num, length) {
	return (Array(length).join('0') + num).slice(-length);
}
