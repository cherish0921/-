const backstatus = {
  'ch': {
    'deposit': {
      'status0': '待充值',
      'status1': '确认中',
      'status2': '待入账',
      'status3': '已入账'
    },
    'withdraw': {
      'status0': '待审核',
      'status1': '处理中',
      'status2': '已完成',
      'status3': '已拒绝',
      'status4': '超出限额'
    },
    'borrow': {
      'status-2': '借款失败',
      'status-1': '借款失败',
      'status0': '进行中',
      'status1': '待还款',
      'status11': '提前还款',
      'status12': '正常还款',
      'status13': '逾期还款',
      'status14': '还款完成',
      'status16': '强制交割',
      'status17': '强制平仓'
    },
    'inverst': {
      'status-2': '投标失败',
      'status-1': '投标失败',
      'status0': '待确认',
      'status1': '成功',
      'status2': '待还款',
      'status3': '已逾期',
      'status11': '提前还款',
      'status12': '正常还款',
      'status13': '逾期还款',
      'status14': '还款完成',
      'status16': '强制交割',
      'status17': '强制平仓'
    }
  },
  'en': {
    'deposit': {
      'status0': 'Recharging',
      'status1': 'Confirming',
      'status2': 'Counting',
      'status3': 'Counted'
    },
    'withdraw': {
      'status0': 'Reviewing',
      'status1': 'Processing',
      'status2': 'Completed',
      'status3': 'Rejected',
      'status4': 'Exceeded'
    },
    'borrow': {
      'status-2': 'Failure',
      'status-1': 'Failure',
      'status0': 'Processing',
      'status1': 'Repayments',
      'status11': 'Prepayment',
      'status12': 'Repayment',
      'status13': 'Overdue repayment',
      'status14': 'Repayment completed',
      'status16': 'Forced delivery(mortgage)',
      'status17': 'Forced closing'
    },
    'inverst': {
      'status-2': 'Failed to bid',
      'status-1': 'Failed to bid',
      'status0': 'To be confirmed',
      'status1': 'Success',
      'status2': 'Await repayment',
      'status3': 'Overdue',
      'status11': 'Prepayment',
      'status12': 'Normal repayment',
      'status13': 'Overdue repayment',
      'status14': 'Repayment completed',
      'status16': 'Forced delivery(mortgage)',
      'status17': 'Forced closing'
    }
  },
  'ko': {
    'deposit': {
      'status0': '확인필요',
      'status1': '확인 중',
      'status2': '기입필요',
      'status3': '기입 완료'
    },
    'withdraw': {
      'status0': '심사필료',
      'status1': '처리 중',
      'status2': '완료된',
      'status3': '거부됐다',
      'status4': '한도 초과'
    },
    'borrow': {
      'status-2': '차입실패',
      'status-1': '차입실패',
      'status0': '진행중',
      'status1': '상환대기중',
      'status11': '미리 상환',
      'status12': '정상 상환',
      'status13': '연체 상환',
      'status14': '상환 완료',
      'status16': '강제 교할',
      'status17': '강제 청산'
    },
    'inverst': {
      'status-2': '입찰 실패',
      'status-1': '입찰 실패',
      'status0': '인대기중',
      'status1': '성공',
      'status2': '상환대기중',
      'status3': '연체',
      'status11': '미리 상환',
      'status12': '정상 상환',
      'status13': '연체 상환',
      'status14': '상환 완료',
      'status16': '강제 교할',
      'status17': '강제 청산'
    }
  }
}

export default backstatus
