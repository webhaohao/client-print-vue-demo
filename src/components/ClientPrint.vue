<template>
    <div>
      <div>
        <el-button type="primary" size="small" @click="handlePrint">打印</el-button>
      </div>  
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="status"
                label="打印状态"
                show-overflow-tooltip>
            </el-table-column>
        </el-table>
    </div>
  </template>
  
  <script>
    import { localClientSocket } from 'local-print-client-socket';
    export default {
      data() {
        return {
          tableData: [
              {
                  name: '张三',
                  reportletName: '1387787880822210560.cpt',
                  status: 0,
              },
              {
                  name: '李四',
                  reportletName: '1387787880822210560.cpt',
                  status: 0,
              },
              {
                  name: '瑞欣',
                  reportletName: '1387787880822210560.cpt',
                  status: 0,
              },
              {
                  name: '亚斌',
                  reportletName: '1387787880822210560.cpt',
                  status: 0,
              }
          ],
          multipleSelection: []
        }
      },

      mounted() {
        localClientSocket.event.on('connect_error', (event) => {
          console.log('event', event);
          localClientSocket.stop();
        });
      },
  
      methods: {
        toggleSelection(rows) {
          console.log('rows', rows);
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
          this.multipleSelection = [...rows];
        },
        handleSelectionChange(val) {
          console.log('val', val);
          this.multipleSelection = val;
        },
        handlePrint() {
          const selectedRows = this.multipleSelection;
          const client = localClientSocket.clientInfo;
          if (!client) {
            this.$message.error('客户端未连接');
          }
          for (let item of selectedRows) {
            const templateId = `${item.reportletName}-${item.name}`;
            const pdf_path = `http://172.16.7.52:8080/winReport/decision/report/fileManager/pdfDownload?reportlet=${item.reportletName}&tableNameEn=SPECI&createdTimeStart=2021-01-01`;
            localClientSocket.send({
              templateId,
              // printer: 'XabVPrinter', // 客户端ID
              type: 'url_pdf', // 打印类型
              pdf_path,
            });
            localClientSocket.event?.on(
              `printSuccess_${templateId}`,
              (templateId) => {
                console.log('打印成功 ===', templateId);
                // 后续逻辑业务自己处理
              },
            );
            localClientSocket.event?.on(`printError_${templateId}`, (templateId) => {
              console.log('打印失败 === ', templateId);
              // 后续逻辑业务自己处理
            });
          }
        }
      }
    }
  </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
  
