// Code templates organized by platform and API version
const templates = {
    formbridge: {
        latest: {
            postalCode: `
// 郵便番号から住所を自動取得 (FormBridge v2 API)
const handlePostalCodeLookup = async (postalCode) => {
    const cleanCode = postalCode.replace(/-/g, "");
    if (cleanCode.length !== 7) return null;
    
    const zip = cleanCode.substr(0, 3);
    const code = cleanCode.substr(3, 4);
    const url = \`https://madefor.github.io/postal-code-api/api/v1/\${zip}/\${code}.json\`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const address = data.data[0].ja;
        return address.prefecture + address.address1 + address.address2;
    } catch (error) {
        console.error('住所取得エラー:', error);
        return null;
    }
};

// FormBridge v2 API: フィールド変更イベント
formBridge.events.on('form.field.change.{{POSTAL_FIELD}}', async (context) => {
    console.log('郵便番号フィールドが変更されました');
    
    const postalCode = context.value;
    if (postalCode && typeof postalCode === 'string') {
        const address = await handlePostalCodeLookup(postalCode);
        if (address) {
            context.setFieldValue('{{ADDRESS_FIELD}}', address);
        }
    }
});`,

            ageCalc: `
// 生年月日から年齢を自動計算 (FormBridge v2 API)
const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// FormBridge v2 API: 生年月日フィールド変更イベント
formBridge.events.on('form.field.change.{{BIRTHDATE_FIELD}}', (context) => {
    console.log('生年月日フィールドが変更されました');
    
    const birthdate = context.value;
    if (birthdate) {
        const age = calculateAge(birthdate);
        if (age !== null && age >= 0) {
            // 年齢を別のフィールドに設定する場合
            // context.setFieldValue('年齢', age);
            console.log(\`計算された年齢: \${age}歳\`);
        }
    }
});`,

            dateValidation: `
// 日付バリデーション (FormBridge v2 API)
const validateDate = (dateValue) => {
    if (!dateValue) return { valid: true, message: '' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻をリセット
    const selectedDate = new Date(dateValue);
    
    // 過去の日付チェック
    if (selectedDate < today) {
        return { valid: false, message: '過去の日付は選択できません' };
    }
    
    // 土日チェック
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { valid: false, message: '土日は選択できません' };
    }
    
    return { valid: true, message: '' };
};

// FormBridge v2 API: 日付フィールド変更イベント
formBridge.events.on('form.field.change.{{DATE_FIELD}}', (context) => {
    console.log('日付フィールドが変更されました');
    
    const dateValue = context.value;
    const validation = validateDate(dateValue);
    
    if (!validation.valid) {
        // エラーメッセージを設定
        context.setFieldValueError('{{DATE_FIELD}}', validation.message);
        // 変更をキャンセル
        context.preventDefault();
    } else {
        // エラーメッセージをクリア
        context.setFieldValueError('{{DATE_FIELD}}', null);
    }
});`,

            fieldValidation: `
// フィールドバリデーション (FormBridge v2 API)
const validateRequiredFields = (record, requiredFields) => {
    const errors = [];
    requiredFields.forEach(fieldCode => {
        const field = record[fieldCode];
        if (!field || !field.value || field.value.toString().trim() === '') {
            errors.push(\`\${fieldCode}は必須項目です\`);
        }
    });
    return errors;
};

// FormBridge v2 API: フォーム送信前バリデーション
formBridge.events.on('form.submit', (context) => {
    console.log('フォーム送信前バリデーションを実行');
    
    const record = formBridge.fn.getRecord();
    const requiredFields = ['{{NAME_FIELD}}', '{{PHONE_FIELD}}'];
    const errors = validateRequiredFields(record, requiredFields);
    
    if (errors.length > 0) {
        alert('入力エラー:\\n' + errors.join('\\n'));
        context.preventDefault();
    }
});`,

            autoComplete: `
//  機能 (FormBridge v2 API)
const createAutoCompleteOptions = (inputValue, suggestions) => {
    if (!inputValue || inputValue.length < 2) return [];
    
    return suggestions.filter(item => 
        item.toLowerCase().includes(inputValue.toLowerCase())
    );
};

// FormBridge v2 API: オートコンプリート機能
formBridge.events.on('form.show', (context) => {
    console.log('フォーム表示時にオートコンプリートを設定');
    
    const suggestions = ['東京都', '大阪府', '愛知県', '福岡県', '北海道', '沖縄県'];
    
    // 住所フィールドの選択肢を動的に更新
    const updateOptions = (inputValue) => {
        const matches = createAutoCompleteOptions(inputValue, suggestions);
        if (matches.length > 0) {
            formBridge.fn.updateFieldSetting('{{ADDRESS_FIELD}}', 'options', matches);
        }
    };
    
    // 初期表示時は全ての選択肢を設定
    formBridge.fn.updateFieldSetting('{{ADDRESS_FIELD}}', 'options', suggestions);
});

// 住所フィールド変更時にオートコンプリート候補を更新
formBridge.events.on('form.field.change.{{ADDRESS_FIELD}}', (context) => {
    const inputValue = context.value;
    const suggestions = ['東京都', '大阪府', '愛知県', '福岡県', '北海道', '沖縄県'];
    const matches = createAutoCompleteOptions(inputValue, suggestions);
    console.log('オートコンプリート候補:', matches);
});`
        },

        legacy: {
            postalCode: `
// 郵便番号から住所を自動取得 (FormBridge v1 API)
const handlePostalCodeLookup = (postalCode) => {
    const cleanCode = postalCode.replace(/-/g, "");
    if (cleanCode.length !== 7) return;
    
    const zip = cleanCode.substr(0, 3);
    const code = cleanCode.substr(3, 4);
    const url = \`https://madefor.github.io/postal-code-api/api/v1/\${zip}/\${code}.json\`;
    
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json'
    })
    .done((data) => {
        const address = data.data[0].ja;
        const fullAddress = address.prefecture + address.address1 + address.address2;
        
        const addressElement = fb.getElementByCode('{{ADDRESS_FIELD}}');
        if (addressElement) {
            addressElement.value = fullAddress;
        }
    })
    .fail((error) => {
        console.error('住所取得エラー:', error);
    });
};

// FormBridge v1 API: フィールド変更イベント
fb.events.fields['{{POSTAL_FIELD}}'].changed = [function(field, value) {
    console.log('郵便番号フィールドが変更されました (v1)');
    
    if (value && typeof value === 'string') {
        handlePostalCodeLookup(value);
    }
}];`,

            ageCalc: `
// 生年月日から年齢を自動計算 (FormBridge v1 API)
const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// FormBridge v1 API: 生年月日フィールド変更イベント
fb.events.fields['{{BIRTHDATE_FIELD}}'].changed = [function(field, value) {
    console.log('生年月日フィールドが変更されました (v1)');
    
    if (value) {
        const age = calculateAge(value);
        if (age !== null && age >= 0) {
            // 年齢を別のフィールドに設定する場合
            // const ageElement = fb.getElementByCode('年齢');
            // if (ageElement) ageElement.value = age;
            console.log(\`計算された年齢: \${age}歳\`);
        }
    }
}];

// FormBridge v1 API: フォーム作成時に初期化
fb.events.form.created = [function(state) {
    console.log('FormBridge created (v1 API)');
    
    // 初期化処理があればここに記述
    return state;
}];`
        }
    },

    kviewer: {
        latest: {
            calendarCustom: `
// カレンダーレイアウト調整 (KViewer v2 API)
(() => {
    'use strict';
    
    // KViewer v2 API: ビュー表示時のカスタマイズ
    kviewer.events.on('view.show', function(context) {
        console.log('KViewer v2: ビューが表示されました');
        
        const customizeCalendarLayout = () => {
            // ヘッダー要素の取得と調整
            const header = document.querySelector('.kv-header');
            const periodLabel = document.querySelector('[data-field-code="period"]') || 
                               document.querySelector('.kv-period-label');
            
            if (header) {
                header.style.display = "flex";
                header.style.justifyContent = "center";
                header.style.alignItems = "center";
            }
            
            if (periodLabel) {
                periodLabel.style.fontSize = "1.5em";
                periodLabel.style.fontWeight = "bold";
                periodLabel.style.margin = "0 20px";
                
                // レスポンシブ対応
                if (window.matchMedia('(max-width: 600px)').matches) {
                    periodLabel.style.fontSize = "1.2rem";
                    periodLabel.style.margin = "0 10px";
                }
            }
        };
        
        // DOM準備完了後に実行
        setTimeout(customizeCalendarLayout, 100);
    });
    
    // KViewer v2 API: レコード表示時のカスタマイズ
    kviewer.events.on('records.show', function(context) {
        console.log('KViewer v2: レコードが表示されました');
        
        const customizeRecordDisplay = () => {
            const recordElements = document.querySelectorAll('.kv-record');
            recordElements.forEach(record => {
                record.style.borderRadius = "8px";
                record.style.transition = "all 0.3s ease";
            });
        };
        
        setTimeout(customizeRecordDisplay, 50);
    });
})();`,

            eventStyling: `
// イベント表示スタイル (KViewer v2 API)
(() => {
    'use strict';
    
    // KViewer v2 API: レコード表示時のスタイリング
    kviewer.events.on('records.show', function(context) {
        console.log('KViewer v2: イベントスタイリング開始');
        
        const styleEvents = () => {
            // KViewer v2のクラス名でイベント要素を取得
            const events = document.querySelectorAll('.kv-event, [data-field-code*="event"]');
            
            events.forEach((event, index) => {
                // 基本スタイル
                event.style.borderRadius = "12px";
                event.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                event.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
                event.style.cursor = "pointer";
                event.style.position = "relative";
                event.style.overflow = "hidden";
                
                // ホバーエフェクト
                event.addEventListener('mouseenter', function() {
                    this.style.transform = "translateY(-4px) scale(1.02)";
                    this.style.boxShadow = "0 8px 12px rgba(0,0,0,0.15)";
                });
                
                event.addEventListener('mouseleave', function() {
                    this.style.transform = "translateY(0) scale(1)";
                    this.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                });
                
                // クリックエフェクト
                event.addEventListener('mousedown', function() {
                    this.style.transform = "translateY(-2px) scale(0.98)";
                });
                
                event.addEventListener('mouseup', function() {
                    this.style.transform = "translateY(-4px) scale(1.02)";
                });
            });
        };
        
        // DOM更新後に実行
        setTimeout(styleEvents, 150);
    });
    
    // 個別レコード表示時のスタイリング
    kviewer.events.on('record.show', function(context) {
        console.log('KViewer v2: 個別レコード表示スタイリング');
        
        const styleRecord = () => {
            const recordDetail = document.querySelector('.kv-record-detail');
            if (recordDetail) {
                recordDetail.style.animation = "fadeInUp 0.4s ease-out";
            }
        };
        
        setTimeout(styleRecord, 50);
    });
})();

// CSS アニメーション定義
const style = document.createElement('style');
style.textContent = \`
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
\`;
document.head.appendChild(style);`,

            timeSlotCustom: `
// 時間枠カスタマイズ (KViewer v2 API)
(() => {
    'use strict';
    
    // KViewer v2 API: ビュー表示時の時間枠カスタマイズ
    kviewer.events.on('view.show', function(context) {
        console.log('KViewer v2: 時間枠カスタマイズ開始');
        
        const customizeTimeSlots = () => {
            // KViewer v2のクラス名とデータ属性で時間枠要素を取得
            const timeSlots = document.querySelectorAll('.kv-time-slot, [data-field-code*="time"]');
            
            timeSlots.forEach((slot, index) => {
                // 基本スタイル
                slot.style.transition = "all 0.3s ease";
                slot.style.borderRadius = "6px";
                slot.style.margin = "2px 0";
                slot.style.padding = "8px";
                
                // 偶数行と奇数行で背景色を変更
                if (index % 2 === 0) {
                    slot.style.backgroundColor = "#f8f9fa";
                } else {
                    slot.style.backgroundColor = "#ffffff";
                }
                
                // 左ボーダーで視覚的なアクセント
                slot.style.borderLeft = "4px solid #007bff";
                
                // ホバー効果
                slot.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = "#e3f2fd";
                    this.style.borderLeftColor = "#0056b3";
                    this.style.transform = "translateX(4px)";
                });
                
                slot.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff";
                    this.style.borderLeftColor = "#007bff";
                    this.style.transform = "translateX(0)";
                });
                
                // 時間情報を取得してカスタマイズ
                const timeData = slot.getAttribute('data-time') || slot.textContent;
                if (timeData && timeData.includes(':')) {
                    slot.style.fontWeight = "500";
                    slot.style.fontFamily = "monospace";
                }
            });
        };
        
        // DOM準備完了後に実行
        setTimeout(customizeTimeSlots, 200);
    });
    
    // レコード表示時の追加カスタマイズ
    kviewer.events.on('records.show', function(context) {
        const addTimeSlotInteractions = () => {
            const timeSlots = document.querySelectorAll('.kv-time-slot');
            
            timeSlots.forEach(slot => {
                slot.addEventListener('click', function() {
                    console.log('時間枠がクリックされました:', this.textContent || this.getAttribute('data-time'));
                });
            });
        };
        
        setTimeout(addTimeSlotInteractions, 100);
    });
})();`,

            holidayManagement: `
// 休日管理 (KViewer v2 API)
(() => {
    'use strict';
    
    // 休日データ（実際の運用では外部APIから取得）
    const holidays = [
        { date: '2024-01-01', name: '元日' },
        { date: '2024-12-25', name: 'クリスマス' },
        { date: '2024-12-29', name: '年末休暇' },
        { date: '2024-12-30', name: '年末休暇' },
        { date: '2024-12-31', name: '大晦日' }
    ];
    
    // KViewer v2 API: ビュー表示時の休日マーキング
    kviewer.events.on('view.show', function(context) {
        console.log('KViewer v2: 休日管理を開始');
        
        const markHolidays = () => {
            holidays.forEach(holiday => {
                // 日付要素を複数のセレクタで検索
                const holidayElements = document.querySelectorAll(
                    \`[data-date="\${holiday.date}"], [data-field-code*="date"][data-value="\${holiday.date}"], .kv-date[data-date="\${holiday.date}"]\`
                );
                
                holidayElements.forEach(element => {
                    // 休日スタイルを適用
                    element.style.backgroundColor = "#ffebee";
                    element.style.color = "#c62828";
                    element.style.fontWeight = "bold";
                    element.style.border = "2px solid #f8bbd9";
                    element.style.borderRadius = "4px";
                    element.classList.add('holiday');
                    
                    // ツールチップ表示
                    element.title = \`休日: \${holiday.name}\`;
                    
                    // 休日アイコンを追加
                    if (!element.querySelector('.holiday-icon')) {
                        const icon = document.createElement('span');
                        icon.className = 'holiday-icon';
                        icon.textContent = '🎌';
                        icon.style.marginRight = '4px';
                        element.prepend(icon);
                    }
                });
            });
        };
        
        setTimeout(markHolidays, 200);
    });
    
    // KViewer v2 API: レコード表示時の休日チェック
    kviewer.events.on('records.show', function(context) {
        const checkHolidayConflicts = () => {
            const recordElements = document.querySelectorAll('.kv-record');
            
            recordElements.forEach(record => {
                const dateElement = record.querySelector('[data-field-code*="date"]');
                if (dateElement) {
                    const recordDate = dateElement.getAttribute('data-value') || dateElement.textContent.trim();
                    const isHoliday = holidays.some(holiday => holiday.date === recordDate);
                    
                    if (isHoliday) {
                        record.style.position = 'relative';
                        
                        // 休日警告バッジを追加
                        if (!record.querySelector('.holiday-warning')) {
                            const warning = document.createElement('div');
                            warning.className = 'holiday-warning';
                            warning.textContent = '休日';
                            warning.style.cssText = \`
                                position: absolute;
                                top: 5px;
                                right: 5px;
                                background: #ff5722;
                                color: white;
                                padding: 2px 8px;
                                border-radius: 12px;
                                font-size: 10px;
                                font-weight: bold;
                                z-index: 10;
                            \`;
                            record.appendChild(warning);
                        }
                    }
                }
            });
        };
        
        setTimeout(checkHolidayConflicts, 100);
    });
})();`,

            bookingRestriction: `
// 予約制限設定 (KViewer v2 API)
(() => {
    'use strict';
    
    // 制限設定
    const restrictions = {
        pastBooking: false, // 過去の日時は予約不可
        weekends: false,    // 土日は予約不可
        maxAdvanceDays: 30, // 最大30日先まで予約可能
        businessHours: {
            start: 9,  // 9時から
            end: 17    // 17時まで
        }
    };
    
    // KViewer v2 API: ビュー表示時の予約制限適用
    kviewer.events.on('view.show', function(context) {
        console.log('KViewer v2: 予約制限設定を適用');
        
        const applyBookingRestrictions = () => {
            const now = new Date();
            const maxDate = new Date();
            maxDate.setDate(now.getDate() + restrictions.maxAdvanceDays);
            
            // 時間枠要素とレコード要素を取得
            const timeSlots = document.querySelectorAll('.kv-time-slot, [data-field-code*="time"], [data-field-code*="date"]');
            
            timeSlots.forEach(slot => {
                const slotDateTime = getSlotDateTime(slot);
                if (!slotDateTime) return;
                
                let isRestricted = false;
                let restrictionReason = '';
                
                // 過去の時間チェック
                if (restrictions.pastBooking && slotDateTime < now) {
                    isRestricted = true;
                    restrictionReason = '過去の日時のため予約できません';
                }
                
                // 土日チェック
                if (restrictions.weekends && (slotDateTime.getDay() === 0 || slotDateTime.getDay() === 6)) {
                    isRestricted = true;
                    restrictionReason = '土日のため予約できません';
                }
                
                // 予約可能期間チェック
                if (slotDateTime > maxDate) {
                    isRestricted = true;
                    restrictionReason = \`\${restrictions.maxAdvanceDays}日以降は予約できません\`;
                }
                
                // 営業時間チェック
                const hour = slotDateTime.getHours();
                if (hour < restrictions.businessHours.start || hour >= restrictions.businessHours.end) {
                    isRestricted = true;
                    restrictionReason = '営業時間外のため予約できません';
                }
                
                // 制限を適用
                if (isRestricted) {
                    applyRestrictionStyle(slot, restrictionReason);
                } else {
                    applyAvailableStyle(slot);
                }
            });
        };
        
        // 日時データを取得する関数
        const getSlotDateTime = (element) => {
            const dateValue = element.getAttribute('data-date') || 
                             element.getAttribute('data-time') ||
                             element.getAttribute('data-value');
            
            if (dateValue) {
                return new Date(dateValue);
            }
            
            // テキストから日時を抽出
            const textContent = element.textContent.trim();
            const dateMatch = textContent.match(/\\d{4}-\\d{2}-\\d{2}|\\d{2}:\\d{2}/);
            if (dateMatch) {
                return new Date(dateMatch[0]);
            }
            
            return null;
        };
        
        // 制限スタイルを適用
        const applyRestrictionStyle = (element, reason) => {
            element.style.backgroundColor = "#f5f5f5";
            element.style.color = "#999";
            element.style.pointerEvents = "none";
            element.style.cursor = "not-allowed";
            element.style.opacity = "0.6";
            element.title = reason;
            
            // 制限アイコンを追加
            if (!element.querySelector('.restriction-icon')) {
                const icon = document.createElement('span');
                icon.className = 'restriction-icon';
                icon.textContent = '🚫';
                icon.style.fontSize = '12px';
                icon.style.marginLeft = '4px';
                element.appendChild(icon);
            }
        };
        
        // 利用可能スタイルを適用
        const applyAvailableStyle = (element) => {
            element.style.backgroundColor = "#e8f5e8";
            element.style.color = "#2e7d32";
            element.style.cursor = "pointer";
            element.style.opacity = "1";
            element.title = "予約可能";
            
            // ホバー効果
            element.addEventListener('mouseenter', function() {
                if (!this.style.pointerEvents || this.style.pointerEvents !== 'none') {
                    this.style.backgroundColor = "#c8e6c9";
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (!this.style.pointerEvents || this.style.pointerEvents !== 'none') {
                    this.style.backgroundColor = "#e8f5e8";
                }
            });
        };
        
        setTimeout(applyBookingRestrictions, 300);
    });
    
    // レコード表示時の追加チェック
    kviewer.events.on('records.show', function(context) {
        console.log('KViewer v2: レコード表示時の制限チェック');
        
        // 既存の予約との重複チェック等の処理をここに追加
        setTimeout(() => {
            console.log('予約制限チェック完了');
        }, 100);
    });
})();`
        },

        legacy: {
            calendarCustom: `
// カレンダーレイアウト調整 (KViewer v1 API)
(() => {
    'use strict';
    
    // KViewer v1 API: レコード表示時のカスタマイズ
    kv.events.records.mounted = [function(state) {
        console.log('KViewer v1: レコードがマウントされました', state);
        
        const customizeCalendarLayout = () => {
            // v1のクラス名を使用
            const headerNav = document.querySelector('.cv-header-nav');
            const periodLabel = document.querySelector('.periodLabel');
            const nextButton = document.querySelector('.cv-header-nav .next');
            const prevButton = document.querySelector('.cv-header-nav .prev');
            
            if (headerNav && periodLabel && nextButton) {
                const header = document.querySelector('.cv-header');
                if (header) {
                    header.style.justifyContent = "center";
                    header.style.display = "flex";
                    header.style.alignItems = "center";
                }
                
                // 期間ラベルをナビゲーションボタンの間に配置
                headerNav.insertBefore(periodLabel, nextButton);
                
                // スタイルを調整
                periodLabel.style.fontSize = "1.4em";
                periodLabel.style.fontWeight = "bold";
                periodLabel.style.margin = "0 15px";
                periodLabel.style.color = "#333";
                
                // ボタンスタイル調整
                [nextButton, prevButton].forEach(btn => {
                    if (btn) {
                        btn.style.backgroundColor = "#007bff";
                        btn.style.color = "white";
                        btn.style.border = "none";
                        btn.style.borderRadius = "6px";
                        btn.style.padding = "8px 12px";
                        btn.style.cursor = "pointer";
                        btn.style.transition = "all 0.3s ease";
                        
                        btn.addEventListener('mouseenter', function() {
                            this.style.backgroundColor = "#0056b3";
                            this.style.transform = "scale(1.05)";
                        });
                        
                        btn.addEventListener('mouseleave', function() {
                            this.style.backgroundColor = "#007bff";
                            this.style.transform = "scale(1)";
                        });
                    }
                });
            }
        };
        
        // DOM準備完了後に実行
        setTimeout(customizeCalendarLayout, 150);
        
        return state;
    }];
    
    // KViewer v1 API: ビュー作成時の初期化
    kv.events.view.created = [function(state) {
        console.log('KViewer v1: ビューが作成されました', state);
        
        // 全体のスタイル調整
        const adjustGlobalStyles = () => {
            const wrapper = document.querySelector('.cv-wrapper');
            if (wrapper) {
                wrapper.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
                wrapper.style.color = "#333";
            }
        };
        
        setTimeout(adjustGlobalStyles, 50);
        
        return state;
    }];
})();`
        }
    },

    kintone: {
        latest: {
            recordUpdate: `
// レコード更新 (Latest API)
(() => {
    'use strict';
    
    kintone.events.on(['app.record.detail.show'], function(event) {
        console.log('Kintone record update (Latest API)', event);
        
        const updateRecord = async () => {
            try {
                const record = event.record;
                const recordId = record.$id.value;
                
                const body = {
                    id: recordId,
                    record: {
                        '{{NAME_FIELD}}': {
                            value: record['{{NAME_FIELD}}'].value + ' (更新済み)'
                        }
                    }
                };
                
                await kintone.api('/k/v1/record', 'PUT', body);
                console.log('レコード更新完了');
            } catch (error) {
                console.error('更新エラー:', error);
            }
        };
        
        return event;
    });
})();`,

            customButton: `
// カスタムボタン追加 (Latest API)
(() => {
    'use strict';
    
    kintone.events.on(['app.record.index.show'], function(event) {
        console.log('Kintone custom button (Latest API)', event);
        
        const menuSpace = kintone.app.getHeaderMenuSpaceElement();
        
        const customButton = document.createElement('button');
        customButton.textContent = 'カスタム処理';
        customButton.className = 'kintoneplugin-button-normal';
        customButton.onclick = async function() {
            try {
                console.log('カスタム処理を実行中...');
                alert('処理が完了しました');
            } catch (error) {
                console.error('エラー:', error);
            }
        };
        
        menuSpace.appendChild(customButton);
        
        return event;
    });
})();`,

            fieldCalculation: `
// フィールド計算 (Latest API)
(() => {
    'use strict';
    
    kintone.events.on(['app.record.create.change.数量', 'app.record.edit.change.数量'], function(event) {
        console.log('Kintone field calculation (Latest API)', event);
        
        const record = event.record;
        const quantity = record['数量'].value || 0;
        const unitPrice = record['単価'].value || 0;
        
        // 合計金額を自動計算
        record['合計金額'].value = quantity * unitPrice;
        
        return event;
    });
})();`,

            statusChange: `
// ステータス自動変更 (Latest API)
(() => {
    'use strict';
    
    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function(event) {
        console.log('Kintone status change (Latest API)', event);
        
        const record = event.record;
        
        // 条件に応じてステータスを自動変更
        if (record['{{NAME_FIELD}}'].value && record['{{PHONE_FIELD}}'].value) {
            record['ステータス'].value = '完了';
        } else {
            record['ステータス'].value = '未完了';
        }
        
        return event;
    });
})();`
        },

        legacy: {
            recordUpdate: `
// レコード更新 (Legacy API)
(() => {
    'use strict';
    
    kintone.events.on(['app.record.detail.show'], function(event) {
        console.log('Kintone record update (Legacy API)', event);
        
        // Legacy APIの処理
        const record = event.record;
        console.log('レコード情報:', record);
        
        return event;
    });
})();`
        }
    },

    common: {
        kintoneUpdate: `
// Kintoneデータ連携 (共通機能)
const sendToKintone = async (data) => {
    try {
        console.log('Kintoneへデータ送信:', data);
        // 実際のKintone API呼び出し処理
        alert('データ送信完了');
    } catch (error) {
        console.error('送信エラー:', error);
    }
};`,

        emailNotification: `
// メール通知 (共通機能)
const sendEmailNotification = (recipient, subject, body) => {
    console.log('メール通知:', { recipient, subject, body });
    // メール送信処理の実装
};`,

        logging: `
// ログ出力 (共通機能)
const logAction = (action, data) => {
    const timestamp = new Date().toISOString();
    console.log(\`[\${timestamp}] \${action}:\`, data);
};`
    }
};

// プラットフォーム変更時に表示する機能を切り替える関数
function updateFeatures() {
    const selectedPlatform = document.querySelector('input[name="platform"]:checked')?.value;
    
    // すべての機能グループを非表示
    document.querySelectorAll('.feature-group').forEach(group => {
        group.style.display = 'none';
    });
    
    // 共通機能は常に表示
    document.getElementById('commonFeatures').style.display = 'block';
    
    // 選択されたプラットフォームの機能を表示
    if (selectedPlatform) {
        const platformFeatures = document.getElementById(selectedPlatform + 'Features');
        if (platformFeatures) {
            platformFeatures.style.display = 'block';
        }
    }
}

// カスタム機能セクションの表示/非表示を切り替え
function toggleCustomRequestSection() {
    const customFunctionCheckbox = document.querySelector('input[value="customFunction"]');
    const customRequestSection = document.getElementById('customRequestSection');
    
    if (customFunctionCheckbox.checked) {
        customRequestSection.style.display = 'block';
        customRequestSection.classList.add('custom-request-active');
    } else {
        customRequestSection.style.display = 'none';
        customRequestSection.classList.remove('custom-request-active');
        
        // チェックが外された時はカスタムリクエストのデータもクリア
        clearCustomRequestData();
    }
}

// カスタムリクエストのトグル機能（内部のチェックボックス用）
function toggleCustomRequest() {
    const checkbox = document.getElementById('useCustomRequest');
    const section = document.querySelector('.custom-request-section');
    
    if (checkbox.checked) {
        section.classList.add('custom-request-active');
    } else {
        section.classList.remove('custom-request-active');
    }
}

// カスタムリクエストのデータをクリアする関数
function clearCustomRequestData() {
    document.getElementById('customFunctionName').value = '';
    document.getElementById('customRequirement').value = '';
    document.getElementById('customImplementation').value = '';
    document.getElementById('customFields').value = '';
    document.getElementById('useCustomRequest').checked = false;
}

// カスタムリクエストのデータを取得
function getCustomRequestData() {
    const customFunctionCheckbox = document.querySelector('input[value="customFunction"]');
    const useCustom = document.getElementById('useCustomRequest').checked;
    
    // カスタム機能がチェックされていて、かつ内部のチェックボックスも選択されている場合のみ
    if (!customFunctionCheckbox.checked || !useCustom) return null;
    
    const functionName = document.getElementById('customFunctionName').value.trim();
    const requirement = document.getElementById('customRequirement').value.trim();
    const implementation = document.getElementById('customImplementation').value.trim();
    const fields = document.getElementById('customFields').value.trim();
    
    if (!functionName || !requirement) {
        return null;
    }
    
    return {
        functionName,
        requirement,
        implementation,
        fields
    };
}

// カスタムリクエストからコードを生成
function generateCustomRequestCode(customData, apiVersion) {
    if (!customData) return '';
    
    const { functionName, requirement, implementation, fields } = customData;
    const fieldsArray = fields ? fields.split(',').map(f => f.trim()).filter(f => f) : [];
    
    if (apiVersion === 'latest') {
        return `
// カスタム機能: ${functionName} (FormBridge v2 API)
// 要件: ${requirement}
${implementation ? `// 実装方法: ${implementation}` : ''}

const ${functionName.replace(/[^a-zA-Z0-9]/g, '')} = {
    // TODO: 以下の要件に基づいて実装してください
    // ${requirement}
    ${implementation ? `// ${implementation}` : ''}
    
    init: function() {
        console.log('カスタム機能「${functionName}」を初期化');
        
        ${fieldsArray.length > 0 ? 
            fieldsArray.map(field => `
        // ${field}フィールドの処理
        formBridge.events.on('form.field.change.${field}', (context) => {
            console.log('${field}フィールドが変更されました:', context.value);
            
            // TODO: ${requirement}の処理をここに実装
            // 例: context.setFieldValue('${field}', processedValue);
        });`).join('\n') : 
            `
        // フィールドが指定されていません。form.showイベントで初期化処理を実行
        formBridge.events.on('form.show', (context) => {
            console.log('フォーム表示時の${functionName}処理');
            // TODO: ${requirement}の処理をここに実装
        });`
        }
    },
    
    // カスタム処理関数（必要に応じて実装）
    process: function(value) {
        // TODO: 実際の処理ロジックを実装
        console.log('処理中:', value);
        return value;
    }
};

// カスタム機能の初期化実行
formBridge.events.on('form.show', (context) => {
    ${functionName.replace(/[^a-zA-Z0-9]/g, '')}.init();
});`;
    } else {
        // Legacy v1 API
        return `
// カスタム機能: ${functionName} (FormBridge v1 API)
// 要件: ${requirement}
${implementation ? `// 実装方法: ${implementation}` : ''}

const ${functionName.replace(/[^a-zA-Z0-9]/g, '')} = {
    // TODO: 以下の要件に基づいて実装してください
    // ${requirement}
    ${implementation ? `// ${implementation}` : ''}
    
    init: function() {
        console.log('カスタム機能「${functionName}」を初期化 (v1)');
    },
    
    // カスタム処理関数
    process: function(value) {
        // TODO: 実際の処理ロジックを実装
        console.log('処理中:', value);
        return value;
    }
};

${fieldsArray.length > 0 ? 
    fieldsArray.map(field => `
// ${field}フィールドの処理 (FormBridge v1)
fb.events.fields['${field}'].changed = [function(field, value) {
    console.log('${field}フィールドが変更されました (v1):', value);
    
    // TODO: ${requirement}の処理をここに実装
    const processedValue = ${functionName.replace(/[^a-zA-Z0-9]/g, '')}.process(value);
    
    // 必要に応じて他のフィールドに値を設定
    // const targetElement = fb.getElementByCode('targetField');
    // if (targetElement) targetElement.value = processedValue;
}];`).join('\n') : 
    `
// フォーム作成時の初期化 (FormBridge v1)
fb.events.form.created = [function(state) {
    console.log('フォーム作成時の${functionName}処理 (v1)');
    ${functionName.replace(/[^a-zA-Z0-9]/g, '')}.init();
    return state;
}];`
}`;
    }
}

// フォームデータを取得する関数
function getFormData() {
    const platform = document.querySelector('input[name="platform"]:checked')?.value;
    const apiVersion = document.querySelector('input[name="apiVersion"]:checked')?.value;
    const features = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    
    return {
        platform: platform,
        apiVersion: apiVersion,
        features: features,
        fields: {
            postal: document.getElementById('postalField').value,
            address: document.getElementById('addressField').value,
            name: document.getElementById('nameField').value,
            phone: document.getElementById('phoneField').value,
            date: document.getElementById('dateField').value,
            birthdate: document.getElementById('birthdateField').value
        }
    };
}

// コードを生成する関数
function generateCode() {
    const formData = getFormData();
    const customRequestData = getCustomRequestData();
    
    if (!formData.platform) {
        alert('プラットフォームを選択してください');
        return;
    }
    
    if (formData.features.length === 0 && !customRequestData) {
        alert('少なくとも1つの機能を選択するか、カスタムリクエストを入力してください');
        return;
    }
    
    let generatedCode = `(()=>{\n    "use strict";\n    \n`;
    
    // 各機能のコードを組み合わせ
    formData.features.forEach(feature => {
        let featureCode = '';
        
        // 共通機能の場合
        if (templates.common && templates.common[feature]) {
            featureCode = templates.common[feature];
        }
        // プラットフォーム固有機能の場合
        else if (templates[formData.platform] && 
                 templates[formData.platform][formData.apiVersion] && 
                 templates[formData.platform][formData.apiVersion][feature]) {
            featureCode = templates[formData.platform][formData.apiVersion][feature];
        }
        
        if (featureCode) {
            // プレースホルダーを実際の値に置換
            featureCode = featureCode
                .replace(/{{POSTAL_FIELD}}/g, formData.fields.postal)
                .replace(/{{ADDRESS_FIELD}}/g, formData.fields.address)
                .replace(/{{NAME_FIELD}}/g, formData.fields.name)
                .replace(/{{PHONE_FIELD}}/g, formData.fields.phone)
                .replace(/{{DATE_FIELD}}/g, formData.fields.date)
                .replace(/{{BIRTHDATE_FIELD}}/g, formData.fields.birthdate);
            
            generatedCode += featureCode + '\n\n';
        }
    });
    
    // カスタムリクエストのコードを追加
    if (customRequestData && formData.platform === 'formbridge') {
        const customCode = generateCustomRequestCode(customRequestData, formData.apiVersion);
        generatedCode += customCode + '\n\n';
    }
    
    generatedCode += `})();`;
    
    // 生成されたコードを表示
    const outputElement = document.getElementById('output');
    outputElement.value = generatedCode;
    
    // コピーボタンを表示
    document.getElementById('copyBtn').style.display = 'inline-block';
    
    // 成功メッセージ
    let successMessage = `コードが正常に生成されました！\n\nプラットフォーム: ${formData.platform}\nAPIバージョン: ${formData.apiVersion}\n機能数: ${formData.features.length}`;
    
    if (customRequestData) {
        successMessage += `\nカスタム機能: ${customRequestData.functionName}`;
    }
    
    alert(successMessage);
}

// クリップボードにコピーする関数
function copyToClipboard() {
    const outputElement = document.getElementById('output');
    outputElement.select();
    document.execCommand('copy');
    alert('コードがクリップボードにコピーされました！');
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Code Generator 初期化完了');
    
    // 初期状態で適切な機能を表示
    updateFeatures();
    
    // プラットフォーム変更時の処理
    document.querySelectorAll('input[name="platform"]').forEach(radio => {
        radio.addEventListener('change', function() {
            console.log('プラットフォーム変更:', this.value);
            updateFeatures();
        });
    });
});