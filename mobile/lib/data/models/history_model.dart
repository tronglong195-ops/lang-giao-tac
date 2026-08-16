class TimelineMilestone {
  final String id;
  final String yearLabel;
  final String title;
  final String content;
  final String? significance;
  final String? icon;

  TimelineMilestone({
    required this.id,
    required this.yearLabel,
    required this.title,
    required this.content,
    this.significance,
    this.icon,
  });

  factory TimelineMilestone.fromJson(Map<String, dynamic> json) {
    return TimelineMilestone(
      id: json['id'] ?? '',
      yearLabel: json['yearLabel'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      significance: json['significance'],
      icon: json['icon'],
    );
  }
}

class HistoryDataModel {
  final List<TimelineMilestone> timelines;
  final String? youtubeVideoUrl;
  final String? youtubeTitle;
  final String? youtubeDescription;
  final String? backgroundMusicUrl;
  final String? backgroundMusicTitle;

  HistoryDataModel({
    required this.timelines,
    this.youtubeVideoUrl,
    this.youtubeTitle,
    this.youtubeDescription,
    this.backgroundMusicUrl,
    this.backgroundMusicTitle,
  });

  factory HistoryDataModel.fromJson(Map<String, dynamic> json) {
    var rawList = json['timelines'] as List<dynamic>?;
    List<TimelineMilestone> list = rawList != null
        ? rawList.map((t) => TimelineMilestone.fromJson(t)).toList()
        : [];

    return HistoryDataModel(
      timelines: list,
      youtubeVideoUrl: json['youtubeVideoUrl'],
      youtubeTitle: json['youtubeTitle'],
      youtubeDescription: json['youtubeDescription'],
      backgroundMusicUrl: json['backgroundMusicUrl'],
      backgroundMusicTitle: json['backgroundMusicTitle'],
    );
  }
}
