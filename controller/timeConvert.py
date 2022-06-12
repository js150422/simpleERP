from datetime import datetime, timedelta
import re

def timeConvert(data):
    if data!=None:
        for i in range(len(data)):
            if 'approveTime-1st' in data[i]:
                if data[i]['approveTime-1st']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['approveTime-1st'].split('.')[0]))+timedelta(hours=8)
                    data[i]['approveTime-1st'] = GMTtime.strftime('%Y-%m-%d %H:%M:%S')
            if 'approveTime-2nd' in data[i]:
                if data[i]['approveTime-2nd']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['approveTime-2nd'].split('.')[0]))+timedelta(hours=8)
                    data[i]['approveTime-2nd'] = GMTtime.strftime('%Y-%m-%d %H:%M:%S')
            if 'approveTime-3th' in data[i]:
                if data[i]['approveTime-3th']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['approveTime-3th'].split('.')[0]))+timedelta(hours=8)
                    data[i]['approveTime-3th'] = GMTtime.strftime('%Y-%m-%d %H:%M:%S')
            if 'commentTime' in data[i]:
                if data[i]['commentTime']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['commentTime'].split('.')[0]))+timedelta(hours=8)
                    data[i]['commentTime'] = GMTtime.strftime('%Y-%m-%d %H:%M:%S')
            if 'orderDate' in data[i]:
                if data[i]['orderDate']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['orderDate'][0:10]))+timedelta(hours=8)
                    data[i]['orderDate'] = GMTtime.strftime('%Y-%m-%d')
            if 'deliveryDate' in data[i]:
                if data[i]['deliveryDate']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['deliveryDate'].split('.')[0]))+timedelta(hours=8)
                    data[i]['deliveryDate'] = GMTtime.strftime('%Y-%m-%d')
            if 'receiptDate' in data[i]:
                if data[i]['receiptDate']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['receiptDate'].split('.')[0]))+timedelta(hours=8)
                    data[i]['receiptDate'] = GMTtime.strftime('%Y-%m-%d')
            if 'changeDate' in data[i]:
                if data[i]['changeDate']!=None:
                    GMTtime=datetime.fromtimestamp(int(data[i]['changeDate'].split('.')[0]))+timedelta(hours=8)
                    data[i]['changeDate'] = GMTtime.strftime('%Y-%m-%d')
            if 'comment' in data[i]:
                if data[i]['comment']!=None:
                    comments = data[i]['comment'].split(',')
                    commentList=[]
                    for m in comments:
                        comment=[]
                        nu_letter = '[\u0030-\u0039]+'
                        GMTtime = datetime.fromtimestamp(int(re.findall(nu_letter,m)[0]))+timedelta(hours=8)
                        commentTime = GMTtime.strftime('%Y-%m-%d %H:%M:%S')
                        commentPersonText = m.split(f'{re.findall(nu_letter,m)[0]}'+'.0')
                        commentPerson = commentPersonText[0]
                        commentText = commentPersonText[1]
                        comment.append(commentTime)
                        comment.append(commentPerson)
                        comment.append(commentText)
                        commentList.append(comment)
                    data[i]['comment']=commentList


            if 'status' in data[i]:
                if data[i]['status']=='running':
                    data[i]['status']='申請中'
                else:
                    data[i]['status']='審核完成'

        return data